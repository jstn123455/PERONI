
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TerminalCommand, AppId, ContentComponentProps, ExperimentalFeaturesState } from '../types';

interface TerminalAppProps extends ContentComponentProps {
  // experimentalFeatures, toggleExperimentalFeature, setExperimentalFeatureValue, playSound
  // are inherited from ContentComponentProps
}

const TerminalApp: React.FC<TerminalAppProps> = ({ openWindow, experimentalFeatures, toggleExperimentalFeature, setExperimentalFeatureValue, playSound }) => {
  const [history, setHistory] = useState<string[]>(['Justin Terzoni OS [Version 1.0.0]', '(c) Justin Terzoni. All rights reserved.', 'Type "help" for a list of commands.']);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const endOfHistoryRef = useRef<HTMLDivElement>(null);
  const [typingParticles, setTypingParticles] = useState<{id: number, x: number, y: number, char: string}[]>([]);


  const createTypingParticle = useCallback((char: string) => {
    if (!experimentalFeatures?.typingParticleBurst || !inputRef.current) return;

    const inputElement = inputRef.current;
    const inputRect = inputElement.getBoundingClientRect();
    
    // Create a temporary span to measure text width up to the cursor
    const span = document.createElement('span');
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.whiteSpace = 'pre'; // Important for accurate width of spaces
    span.style.font = window.getComputedStyle(inputElement).font;
    span.textContent = inputElement.value.substring(0, inputElement.selectionStart || 0);
    
    document.body.appendChild(span); // Append to body for measurement
    const textWidth = span.offsetWidth;
    document.body.removeChild(span);

    // Calculate particle start position relative to the input field's viewport coordinates
    // `inputRect.left` is viewport-relative X of input start
    // `textWidth` is width of text before cursor
    // `inputRect.top` is viewport-relative Y of input top
    const particleStartX = inputRect.left + textWidth; 
    const particleStartY = inputRect.top + inputRect.height / 2;

    const newParticleId = Math.random();
    setTypingParticles(prev => [
        ...prev,
        { id: newParticleId, x: particleStartX, y: particleStartY, char }
    ]);
    
    setTimeout(() => {
        setTypingParticles(currentParticles => currentParticles.filter(particle => particle.id !== newParticleId));
    }, 500); // Particle visible duration

  }, [experimentalFeatures?.typingParticleBurst]);
  

  const availableCommands: Record<string, TerminalCommand> = {
    help: {
      command: 'help',
      description: 'Shows a list of available commands.',
      action: () => {
        const commandList = Object.values(availableCommands)
          .map(cmd => `${cmd.command} - ${cmd.description}`)
          .join('\n');
        return `Available commands:\n${commandList}`;
      },
    },
    clear: {
      command: 'clear',
      description: 'Clears the terminal screen.',
      action: () => {
        setHistory([]);
        return ''; 
      },
    },
    date: {
      command: 'date',
      description: 'Displays the current date and time.',
      action: () => new Date().toString(),
    },
    echo: {
        command: 'echo',
        description: 'Displays a message.',
        action: (args) => args.join(' '),
    },
    open: {
        command: 'open',
        description: 'Opens an application. Usage: open <app_name>',
        action: (args, openAppFunc) => { 
            if (args.length === 0) return 'Usage: open <app_name> (e.g., open about)';
            const appToOpen = args[0].toLowerCase() as AppId;
            if (['home', 'about', 'skills', 'experience', 'contact', 'terminal', 'admin', 'plinko', 'experimental'].includes(appToOpen)) {
                 if (openAppFunc) { 
                    openAppFunc(appToOpen);
                    return `Attempting to open ${appToOpen}...`;
                 } else {
                    return `Error: openWindow function not available to terminal.`;
                 }
            }
            return `Error: App "${appToOpen}" not found. Try: home, about, skills, experience, contact, terminal, admin, plinko.`;
        }
    },
    motd: {
      command: 'motd',
      description: 'Displays the message of the day.',
      action: () => {
          if (experimentalFeatures?.personalizedGreeting) {
            const hour = new Date().getHours();
            if (hour < 12) return "MOTD: Good morning, commander! Systems online.";
            if (hour < 18) return "MOTD: Good afternoon! The digital frontier awaits.";
            return "MOTD: Good evening. The night is young, and the code is calling.";
          }
          return 'Welcome, Justin! Ready to build something amazing today?';
      }
    },
    whoami: {
      command: 'whoami',
      description: 'Displays current user (you!).',
      action: () => 'justin_terzoni_dev',
    },
    theme: {
        command: 'theme',
        description: 'Experimental: theme <subcommand> <value>. Subcommands: accent <hex_color>, font <font_name>, density <compact|comfortable|spacious>, glass <0.1-1.0>',
        action: (args) => { 
            if (!setExperimentalFeatureValue || !experimentalFeatures) return "Theme commands require experimental features and correctly passed setters.";
            const [subcommand, ...valueParts] = args;
            const value = valueParts.join(' ');
            
            playSound?.('click');

            if (subcommand === 'accent' && /^#([0-9A-Fa-f]{3,4}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(value)) {
                setExperimentalFeatureValue('accentColor', value);
                return `Accent color set to ${value}.`;
            } else if (subcommand === 'font') {
                if(value && value.length > 3) {
                    setExperimentalFeatureValue('uiFont', value);
                    return `UI font set to ${value}.`;
                }
                return `Invalid font name: ${value}`;
            } else if (subcommand === 'density' && ['compact', 'comfortable', 'spacious'].includes(value)) {
                setExperimentalFeatureValue('uiDensity', value as NonNullable<ExperimentalFeaturesState['uiDensity']>);
                return `UI density set to ${value}.`;
            } else if (subcommand === 'glass' && !isNaN(parseFloat(value)) && parseFloat(value) >=0.1 && parseFloat(value) <=1){
                setExperimentalFeatureValue('glassmorphismIntensity', parseFloat(value));
                return `Glassmorphism intensity set to ${value}.`;
            }
            return 'Usage: theme accent <#hex> | font <name> | density <compact|comfortable|spacious> | glass <0.1-1.0>';
        }
    },
     togglefeature: { // New command to toggle boolean features
        command: 'togglefeature',
        description: 'Toggles an experimental feature. Usage: togglefeature <typingParticleBurst|personalizedGreeting|uiSoundEffects>',
        action: (args) => {
            if (!toggleExperimentalFeature || !experimentalFeatures) return "Toggle commands require experimental features and correctly passed setters.";
            const featureToToggle = args[0] as keyof ExperimentalFeaturesState;
            const validFeatures: (keyof ExperimentalFeaturesState)[] = ['typingParticleBurst', 'personalizedGreeting', 'uiSoundEffects'];

            if (args.length === 0 || !validFeatures.includes(featureToToggle) || typeof experimentalFeatures[featureToToggle] !== 'boolean') {
                return `Usage: togglefeature <${validFeatures.join('|')}>`;
            }
            
            toggleExperimentalFeature(featureToToggle);
            playSound?.('click');
            return `Experimental feature '${featureToToggle}' is now ${!experimentalFeatures[featureToToggle] ? 'ON' : 'OFF'}.`;
        }
    },
    playsound: {
        command: 'playsound',
        description: 'Plays a test UI sound. Usage: playsound <open|close|click|error|notify|drag|quantum>',
        action: (args) => { 
            if (!experimentalFeatures?.uiSoundEffects) return "UI Sound Effects are disabled. Enable with 'togglefeature uiSoundEffects'.";
            const soundType = args[0] as any; 
            if (['open', 'close', 'click', 'error', 'notify', 'drag', 'quantum'].includes(soundType)) {
                playSound?.(soundType);
                return `Playing sound: ${soundType}`;
            }
            return "Usage: playsound <open|close|click|error|notify|drag|quantum>";
        }
    }
  };


  const processCommand = useCallback((cmdText: string) => {
    const newHistoryLine = `> ${cmdText}`;
    let output: string | void | Promise<string | void> = '';

    const [commandName, ...args] = cmdText.trim().split(/\s+/);

    if (commandName && availableCommands[commandName.toLowerCase()]) {
      output = availableCommands[commandName.toLowerCase()].action(args, openWindow);
    } else if (commandName) {
      output = `Command not found: ${commandName}. Type "help".`;
      playSound?.('error');
    } else {
      playSound?.('click'); 
    }
    
    Promise.resolve(output).then(resolvedOutput => {
        if (typeof resolvedOutput === 'string' && resolvedOutput.length > 0) {
            setHistory(prev => [...prev, newHistoryLine, ...resolvedOutput.split('\n')]);
        } else if (typeof resolvedOutput === 'string') { 
            setHistory(prev => [...prev, newHistoryLine]);
        } else { 
             setHistory(prev => [...prev, newHistoryLine]);
        }
    });

  }, [availableCommands, openWindow, playSound, experimentalFeatures, setExperimentalFeatureValue, toggleExperimentalFeature]); 


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      processCommand(input.trim());
    } else {
      setHistory(prev => [...prev, `> `]); 
      playSound?.('click');
    }
    setInput('');
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const newChar = newValue.length > input.length ? newValue.slice(-1) : '';
    setInput(newValue);
    if (newChar && newChar.length === 1 && experimentalFeatures?.typingParticleBurst) { 
        createTypingParticle(newChar);
    }
  };


  useEffect(() => {
    endOfHistoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Particles are positioned fixed to viewport, then CSS transforms them.
  // Their x, y are viewport coordinates.
  const particleElements = typingParticles.map(p => (
    <div key={p.id} className="fixed text-green-400 animate-particle-burst text-sm"
         style={{
            left: `${p.x}px`, 
            top: `${p.y}px`,  
            '--tx': `${(Math.random() - 0.5) * 40}px`, // Random horizontal travel
            '--ty': `${(Math.random() - 0.5) * 40 - 20}px`, // Random vertical travel (mostly upwards)
            zIndex: 99999, // Ensure particles are on top
         } as React.CSSProperties}
    >
        {p.char}
    </div>
  ));

  return (
    <> {/* Fragment to hold particles at a higher level if needed, or keep them inside */}
      {/* Render particles outside the scrollable area if they need to overlay everything */}
      {/* For now, keeping them inside the terminal window structure */}
      {/* If particles need to escape the window, they must be rendered in App.tsx or similar */}
      {particleElements}
      <div className="h-full flex flex-col p-1" onClick={() => inputRef.current?.focus()}>
        <div className="flex-grow overflow-y-auto text-xs leading-normal whitespace-pre-wrap break-words relative">
          {history.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
          <div ref={endOfHistoryRef} />
        </div>
        <form onSubmit={handleSubmit} className="flex items-center pt-1">
          <span className="text-green-400 mr-1">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            className="bg-transparent border-none text-green-400 focus:outline-none flex-grow text-xs"
            spellCheck="false"
            autoFocus
            autoComplete="off"
            aria-label="Terminal input"
          />
        </form>
      </div>
    </>
  );
};

export default TerminalApp;