
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


  const createTypingParticle = (char: string) => {
    if (!experimentalFeatures?.typingParticleBurst) return;
    if (!inputRef.current) return;

    const inputRect = inputRef.current.getBoundingClientRect();
    const span = document.createElement('span');
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    // Ensure font style is copied for accurate width measurement
    span.style.font = window.getComputedStyle(inputRef.current).font; 
    span.textContent = inputRef.current.value.substring(0, inputRef.current.selectionStart || 0);
    
    // Append to a temporary container or the input's parent if direct body append causes issues
    const parentContainer = inputRef.current.offsetParent || document.body;
    parentContainer.appendChild(span);
    const textWidth = span.offsetWidth;
    parentContainer.removeChild(span);


    const cursorApproxX = inputRect.left + textWidth + 2; // Add some padding
    const cursorApproxY = inputRect.top + inputRect.height / 2;


    setTypingParticles(prev => [
        ...prev,
        { id: Math.random(), x: cursorApproxX, y: cursorApproxY, char }
    ]);
    setTimeout(() => setTypingParticles(p => p.filter(particle => particle.id !== typingParticles[0]?.id)), 500); 
  };
  

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
            return `Error: App "${appToOpen}" not found. Try: home, about, skills, experience, contact, terminal, admin, plinko, experimental.`;
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
        description: 'Experimental: theme <subcommand> <value>. Subcommands: accent <hex_color>, font <font_name>, density <compact|comfortable|spacious>',
        action: (args) => { // Uses setExperimentalFeatureValue, experimentalFeatures, playSound from closure
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
    playsound: {
        command: 'playsound',
        description: 'Plays a test UI sound. Usage: playsound <open|close|click|error|notify|drag|quantum>',
        action: (args) => { // Uses experimentalFeatures, playSound from closure
            if (!experimentalFeatures?.uiSoundEffects) return "UI Sound Effects are disabled in Experimental Panel.";
            const soundType = args[0] as any; // Consider defining specific sound types
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
      // Call action with only args and openWindow, as per TerminalCommand type
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

  }, [availableCommands, openWindow, playSound, experimentalFeatures, setExperimentalFeatureValue, toggleExperimentalFeature]); // Added dependencies


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
    const newChar = e.target.value.length > input.length ? e.target.value.slice(-1) : '';
    setInput(e.target.value);
    if (newChar && newChar !== ' ' && newChar.length === 1) { 
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

  return (
    <div className="h-full flex flex-col p-1" onClick={() => inputRef.current?.focus()}>
      <div className="flex-grow overflow-y-auto text-xs leading-normal whitespace-pre-wrap break-words relative">
        {history.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
        <div ref={endOfHistoryRef} />
        {typingParticles.map(p => (
            <div key={p.id} className="absolute text-green-400 pointer-events-none animate-particle-burst"
                 style={{
                    left: p.x - (inputRef.current?.offsetParent?.getBoundingClientRect().left || 0) - (inputRef.current?.offsetLeft || 0), 
                    top: p.y - (inputRef.current?.offsetParent?.getBoundingClientRect().top || 0) - (inputRef.current?.offsetTop || 0),  
                    '--tx': `${(Math.random() - 0.5) * 30}px`,
                    '--ty': `${(Math.random() - 0.5) * 30 - 10}px`
                 } as React.CSSProperties}
            >
                {p.char}
            </div>
        ))}
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
        />
      </form>
    </div>
  );
};

export default TerminalApp;
