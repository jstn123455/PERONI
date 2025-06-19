
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import { WindowConfig, WindowInstance, AppId, ExperimentalFeaturesState } from './types';

// Import section content components
import HeroContent from './components/sections/HeroContent';
import AboutContent from './components/sections/AboutContent';
import SkillsContent from './components/sections/SkillsContent';
import ExperienceContent from './components/sections/ExperienceContent';
import ContactContent from './components/sections/ContactContent';
import TerminalApp from './components/TerminalApp';
import AdminContent from './components/sections/AdminContent';
import PlinkoGameContent from './components/sections/PlinkoGameContent';
import ExperimentalContent from './components/sections/ExperimentalContent'; // Import new content

const initialApps: Record<AppId, WindowConfig> = {
  home: { id: 'home', title: 'Welcome', content: HeroContent, initialSize: { width: 600, height: 400 }, initialPosition: { x: 50, y: 50 } },
  about: { id: 'about', title: 'About Me', content: AboutContent, initialSize: { width: 700, height: 550 }, initialPosition: { x: 100, y: 100 } },
  skills: { id: 'skills', title: 'My Tech Arsenal', content: SkillsContent, initialSize: { width: 800, height: 600 }, initialPosition: { x: 150, y: 150 } },
  experience: { id: 'experience', title: 'My Journey & Capabilities', content: ExperienceContent, initialSize: { width: 750, height: 650 }, initialPosition: { x: 200, y: 200 } },
  contact: { id: 'contact', title: 'Let\'s Connect', content: ContactContent, initialSize: { width: 550, height: 680 }, initialPosition: { x: 250, y: 250 } },
  terminal: { id: 'terminal', title: 'Terminal', content: TerminalApp, initialSize: { width: 600, height: 400 }, initialPosition: { x: 300, y: 100 }, isTerminal: true },
  admin: { id: 'admin', title: 'Admin Panel', content: AdminContent, initialSize: { width: 700, height: 500 }, initialPosition: { x: 350, y: 150 } },
  plinko: { id: 'plinko', title: 'Plinko Drop', content: PlinkoGameContent, initialSize: { width: 400, height: 600 }, initialPosition: {x: 400, y: 120} },
  experimental: { id: 'experimental', title: 'Experiments Lab', content: ExperimentalContent, initialSize: { width: 550, height: 650 }, initialPosition: {x: 450, y: 180} },
};


const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [maxWindowId, setMaxWindowId] = useState(0);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  const [experimentalFeatures, setExperimentalFeatures] = useState<ExperimentalFeaturesState>({
    typingParticleBurst: false,
    personalizedGreeting: false,
    uiSoundEffects: false,
    accentColor: '#0ea5e9', // Default sky-500
    uiFont: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    uiDensity: 'comfortable',
    glassmorphismIntensity: 0.9,
  });

  const playSound = useCallback((soundId: string) => {
    if (!experimentalFeatures.uiSoundEffects) return;
    console.log(`Playing sound: ${soundId}`);
    // Future: implement actual sound playback using Howler.js or Audio API
    // For now, simple console log if enabled
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Volume

    switch (soundId) {
        case 'click':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
        case 'open':
        case 'focus':
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
            oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
        case 'close':
        case 'minimize':
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
            oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
        case 'maximize':
        case 'restore':
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.15);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);
            break;
        case 'notify':
             oscillator.type = 'sine';
             oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
             gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.3);
             oscillator.start(audioContext.currentTime);
             oscillator.stop(audioContext.currentTime + 0.3);
            break;
        case 'error':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
            oscillator.frequency.exponentialRampToValueAtTime(110, audioContext.currentTime + 0.2);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            break;
        case 'startup':
            // Ascending chord
            const freqs = [261.63, 329.63, 392.00]; // C4, E4, G4
            freqs.forEach((freq, i) => {
                const osc = audioContext.createOscillator();
                const gn = audioContext.createGain();
                osc.connect(gn);
                gn.connect(audioContext.destination);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.1);
                gn.gain.setValueAtTime(0.08, audioContext.currentTime + i * 0.1);
                gn.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + i * 0.1 + 0.3);
                osc.start(audioContext.currentTime + i * 0.1);
                osc.stop(audioContext.currentTime + i * 0.1 + 0.3);
            });
            break;
        default:
            // console.log(`Sound not implemented: ${soundId}`);
            break;
    }
  }, [experimentalFeatures.uiSoundEffects]);

  const toggleExperimentalFeature = useCallback((feature: keyof ExperimentalFeaturesState) => {
    setExperimentalFeatures(prev => ({ ...prev, [feature]: !prev[feature] }));
  }, []);

  const setExperimentalFeatureValue = useCallback((feature: keyof ExperimentalFeaturesState, value: any) => {
    setExperimentalFeatures(prev => ({ ...prev, [feature]: value }));
  }, []);


  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
       setWindows(prev => prev.map(w => w.isMaximized ? ({
        ...w,
        position: {x: 0, y: 0},
        size: { width: window.innerWidth, height: window.innerHeight - 48}
       }) : w));
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const openWindow = useCallback((appId: AppId) => {
    const appConfig = initialApps[appId];
    if (!appConfig) return;

    const existingWindow = windows.find(w => w.appId === appId && !w.isMinimized);
    if (existingWindow) {
      setWindows(prevWindows =>
        prevWindows.map(w =>
          w.id === existingWindow.id ? { ...w, zIndex: nextZIndex, isMinimized: false, isMaximized: isMobileView || w.isMaximized } : w
        )
      );
      setNextZIndex(prev => prev + 1);
      return;
    }
    
    const minimizedWindow = windows.find(w => w.appId === appId && w.isMinimized);
    if (minimizedWindow) {
        setWindows(prevWindows =>
            prevWindows.map(w =>
                w.id === minimizedWindow.id ? { ...w, isMinimized: false, isMaximized: isMobileView || w.isMaximized, zIndex: nextZIndex } : w
            )
        );
        setNextZIndex(prev => prev + 1);
        return;
    }

    const newWindowId = maxWindowId + 1;
    setMaxWindowId(newWindowId);

    const newWindow: WindowInstance = {
      id: `window-${appConfig.id}-${newWindowId}`,
      appId: appConfig.id,
      title: appConfig.title,
      content: appConfig.content,
      position: isMobileView ? { x:0, y:0 } : { ...appConfig.initialPosition },
      size: isMobileView ? { width: window.innerWidth, height: window.innerHeight - 48 } : { ...appConfig.initialSize },
      zIndex: nextZIndex,
      isOpen: true,
      isMinimized: false,
      isMaximized: isMobileView,
      isTerminal: !!appConfig.isTerminal,
    };
    setWindows(prevWindows => [...prevWindows, newWindow]);
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex, windows, maxWindowId, isMobileView]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prevWindows => prevWindows.filter(w => w.id !== id));
    playSound('close');
  }, [playSound]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prevWindows =>
      prevWindows.map(w => 
        w.id === id ? { ...w, isMinimized: true, isMaximized: false } : w
      )
    );
    playSound('minimize');
  }, [playSound]);
  
  const toggleMaximizeWindow = useCallback((id: string) => {
    setWindows(prevWindows =>
      prevWindows.map(w => {
        if (w.id === id) {
          if (isMobileView) {
            playSound('maximize');
            return {
              ...w,
              isMaximized: true,
              isMinimized: false, 
              zIndex: nextZIndex,
              position: { x: 0, y: 0 },
              size: { width: window.innerWidth, height: window.innerHeight - 48 },
            };
          }
          const isCurrentlyMaximized = w.isMaximized;
          playSound(isCurrentlyMaximized ? 'restore' : 'maximize');
          return {
            ...w,
            isMaximized: !isCurrentlyMaximized,
            isMinimized: false,
            zIndex: nextZIndex, 
            prevPosition: !isCurrentlyMaximized ? w.position : w.prevPosition,
            prevSize: !isCurrentlyMaximized ? w.size : w.prevSize,
            position: !isCurrentlyMaximized ? { x: 0, y: 0 } : (w.prevPosition || w.position),
            size: !isCurrentlyMaximized ? { width: window.innerWidth, height: window.innerHeight - 48 } : (w.prevSize || w.size),
          };
        }
        return w;
      })
    );
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex, isMobileView, playSound]);

  const focusWindow = useCallback((id: string) => {
    setWindows(prevWindows =>
      prevWindows.map(w => {
        if (w.id === id) {
          if (w.zIndex !== nextZIndex -1 && !w.isMinimized) playSound('focus');
          if (isMobileView) { 
            return { ...w, zIndex: nextZIndex, isMinimized: false, isMaximized: true };
          }
          return { ...w, zIndex: nextZIndex, isMinimized: false };
        }
        return w;
      })
    );
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex, isMobileView, playSound]);

  const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
    if (isMobileView) return;
    setWindows(prevWindows =>
      prevWindows.map(w => (w.id === id ? { ...w, position } : w))
    );
  }, [isMobileView]);
  
  const updateWindowSize = useCallback((id: string, size: { width: number; height: number }) => {
    if (isMobileView) return;
    setWindows(prevWindows =>
      prevWindows.map(w => (w.id === id ? { ...w, size } : w))
    );
  }, [isMobileView]);

  useEffect(() => {
    openWindow('home');
    playSound('startup');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="h-full flex flex-col antialiased overflow-hidden" style={{fontFamily: experimentalFeatures.uiFont}}>
      <Desktop
        windows={windows}
        onCloseWindow={closeWindow}
        onMinimizeWindow={minimizeWindow}
        onMaximizeWindow={toggleMaximizeWindow}
        onFocusWindow={focusWindow}
        onUpdateWindowPosition={updateWindowPosition}
        onUpdateWindowSize={updateWindowSize} 
        openWindow={openWindow}
        isMobileView={isMobileView}
        experimentalFeatures={experimentalFeatures}
        toggleExperimentalFeature={toggleExperimentalFeature}
        setExperimentalFeatureValue={setExperimentalFeatureValue}
        playSound={playSound}
      />
      <Taskbar
        apps={initialApps}
        openWindows={windows}
        onOpenWindow={(appId) => { openWindow(appId); playSound('open'); }}
        onFocusWindow={focusWindow}
        onMinimizeWindow={minimizeWindow}
        isMobileView={isMobileView}
        experimentalFeatures={experimentalFeatures}
      />
    </div>
  );
};

export default App;