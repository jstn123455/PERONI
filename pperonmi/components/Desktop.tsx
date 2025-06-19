
import React from 'react';
import Window from './Window';
import AnimatedBackground from './AnimatedBackground';
import { WindowInstance, AppId, ExperimentalFeaturesState, ContentComponentProps } from '../types';

interface DesktopProps {
  windows: WindowInstance[]; 
  onCloseWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  onMaximizeWindow: (id: string) => void;
  onFocusWindow: (id: string) => void;
  onUpdateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  onUpdateWindowSize: (id: string, size: {width: number; height: number}) => void;
  openWindow: (appId: AppId) => void;
  isMobileView: boolean;
  experimentalFeatures: ExperimentalFeaturesState;
  toggleExperimentalFeature: (feature: keyof ExperimentalFeaturesState) => void;
  setExperimentalFeatureValue: (feature: keyof ExperimentalFeaturesState, value: any) => void;
  playSound: (soundId: string) => void;
}

const Desktop: React.FC<DesktopProps> = ({
  windows,
  onCloseWindow,
  onMinimizeWindow,
  onMaximizeWindow,
  onFocusWindow,
  onUpdateWindowPosition,
  onUpdateWindowSize,
  openWindow,
  isMobileView,
  experimentalFeatures,
  toggleExperimentalFeature,
  setExperimentalFeatureValue,
  playSound,
}) => {
  const renderedWindows = windows.filter(w => !w.isMinimized);
  
  return (
    <div className="relative flex-grow h-full w-full overflow-hidden bg-os-desktop">
      <AnimatedBackground />
      {renderedWindows.map((win) => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          initialPosition={win.position}
          initialSize={win.size}
          zIndex={win.zIndex}
          isMaximized={win.isMaximized}
          isTerminal={win.isTerminal}
          onClose={() => onCloseWindow(win.id)}
          onMinimize={() => onMinimizeWindow(win.id)}
          onMaximize={() => onMaximizeWindow(win.id)}
          onFocus={() => onFocusWindow(win.id)}
          onDrag={(pos) => onUpdateWindowPosition(win.id, pos)}
          onDragStop={(pos) => onUpdateWindowPosition(win.id, pos)}
          openApp={openWindow}
          isMobileView={isMobileView}
          isMinimized={win.isMinimized}
          experimentalFeatures={experimentalFeatures}
          toggleExperimentalFeature={toggleExperimentalFeature}
          setExperimentalFeatureValue={setExperimentalFeatureValue}
          playSound={playSound}
        >
          <win.content 
            openWindow={openWindow}
            experimentalFeatures={experimentalFeatures}
            toggleExperimentalFeature={toggleExperimentalFeature}
            setExperimentalFeatureValue={setExperimentalFeatureValue}
            playSound={playSound}
          />
        </Window>
      ))}
    </div>
  );
};

export default Desktop;