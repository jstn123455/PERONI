
import React from 'react';
import { useDraggable } from '../hooks/useDraggable';
import XIcon from './icons/XIcon';
import MinimizeIcon from './icons/MinimizeIcon';
import MaximizeIcon from './icons/MaximizeIcon';
import RestoreIcon from './icons/RestoreIcon';
import { AppId, ContentComponentProps } from '../types';

interface WindowProps {
  id: string;
  title: string;
  children: React.ReactNode;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  zIndex: number;
  isMaximized: boolean;
  isTerminal?: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onDrag: (position: { x: number; y: number }) => void; 
  onDragStop: (position: { x: number; y: number }) => void;
  openApp?: (appId: AppId) => void;
  isMobileView: boolean;
  isMinimized: boolean;
}

const WindowComponent: React.FC<WindowProps> = ({
  id,
  title,
  children,
  initialPosition,
  initialSize,
  zIndex,
  isMaximized,
  isTerminal = false,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  onDrag,
  onDragStop,
  openApp,
  isMobileView,
  isMinimized,
}) => {
  
  const effectivelyMaximized = isMaximized || (isMobileView && !isMinimized);

  const { 
    position: currentPosition,
    ref: draggableRef, 
    ...dragEventHandlers 
  } = useDraggable({
    initialPosition,
    initialSize,
    onDrag: (pos) => onDrag(pos), // Corrected: useDraggable's onDrag expects (position) => void
    onDragStop,
    disabled: effectivelyMaximized,
  });

  const windowBgColor = 'rgba(30, 41, 59, 0.9)'; // Fixed background color

  const windowBaseStyle: React.CSSProperties = {
    position: 'absolute',
    opacity: 1, // Fixed opacity
    backgroundColor: windowBgColor,
    zIndex,
    transition: 'opacity 0.3s ease, filter 0.3s ease', 
  };
  
  const windowDynamicStyle: React.CSSProperties = effectivelyMaximized ? {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  } : {
    top: currentPosition.y,
    left: currentPosition.x,
    width: initialSize.width,
    height: initialSize.height,
  };

  const windowStyle: React.CSSProperties = {
      ...windowBaseStyle,
      ...windowDynamicStyle,
  };

  let contentWithProps = children;
   if (React.isValidElement(children) && typeof children.type === 'function') {
    // Cast children to ReactElement with ContentComponentProps to satisfy cloneElement
    // This assumes all window content components can accept these props,
    // which is managed by ContentComponentProps interface.
    contentWithProps = React.cloneElement(children as React.ReactElement<ContentComponentProps>, { 
      openWindow: openApp,
      // Pass down other props if they were part of WindowProps and meant for children
      // For now, only openWindow is explicitly passed.
      // If experimentalFeatures, etc., are needed by children, they should be threaded through App -> Desktop -> Window -> Child
      // or directly if WindowProps was extended.
      // Given ContentComponentProps, this implies children might expect these.
      // However, WindowProps itself doesn't have experimentalFeatures to pass.
      // This part might need adjustment based on how experimentalFeatures are intended to reach TerminalApp.
      // Assuming they are passed from App directly to the specific content component.
    });
  }


  return (
    <div
      ref={draggableRef}
      id={id}
      className={`absolute flex flex-col backdrop-blur-md shadow-window rounded-lg overflow-hidden border border-slate-700/50 
                 ${effectivelyMaximized ? 'rounded-none border-none' : ''} 
                 animate-windowOpen`}
      style={windowStyle}
      onMouseDownCapture={onFocus} 
      onTouchStartCapture={onFocus}
    >
      {/* Title Bar */}
      <div
        {...(!effectivelyMaximized ? dragEventHandlers : {})} 
        className={`flex items-center justify-between h-8 px-2 text-slate-300 select-none bg-os-title-bar ${effectivelyMaximized ? '' : 'cursor-grab active:cursor-grabbing'}`}
        onDoubleClick={onMaximize}
      >
        <span className="text-xs font-semibold truncate">{title}</span>
        <div className="flex items-center space-x-1">
          <button
            onClick={onMinimize}
            className="p-1 rounded hover:bg-slate-600/50 transition-colors"
            aria-label="Minimize window"
          >
            <MinimizeIcon className="w-4 h-4" />
          </button>
          {!isMobileView && (
            <button
              onClick={onMaximize}
              className="p-1 rounded hover:bg-slate-600/50 transition-colors"
              aria-label={isMaximized ? "Restore window" : "Maximize window"}
            >
              {isMaximized ? <RestoreIcon className="w-4 h-4" /> : <MaximizeIcon className="w-4 h-4" />}
            </button>
          )}
           {isMobileView && ( 
            <button
              onClick={onMaximize}
              className="p-1 rounded hover:bg-slate-600/50 transition-colors"
              aria-label={"Focus window"}
            >
             <MaximizeIcon className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-red-500/80 transition-colors"
            aria-label="Close window"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className={`flex-grow overflow-auto os-window-content ${isTerminal ? 'bg-black text-green-400 font-mono text-sm p-2' : 'text-slate-200'}`}>
        {contentWithProps}
      </div>
    </div>
  );
};

export default WindowComponent;
