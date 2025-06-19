
import React from 'react';
import Window from './Window';
import AnimatedBackground from './AnimatedBackground';
import { WindowInstance, AppId } from '../types';

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
          onDragStop={(pos) => onUpdateWindowPosition(win.id, pos)} // Simplified, onDragStop might not be needed if continuous updates are fine
          openApp={openWindow}
          isMobileView={isMobileView}
          isMinimized={win.isMinimized}
        >
          <win.content 
            openWindow={openWindow} 
          />
        </Window>
      ))}
    </div>
  );
};

export default Desktop;