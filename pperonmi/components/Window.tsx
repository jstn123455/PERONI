
import React from 'react';
import { useDraggable } from '../hooks/useDraggable';
import XIcon from './icons/XIcon';
import MinimizeIcon from './icons/MinimizeIcon';
import MaximizeIcon from './icons/MaximizeIcon';
import RestoreIcon from './icons/RestoreIcon';
import { AppId, ContentComponentProps, ExperimentalFeaturesState, WindowProps } from '../types'; // Updated import

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
  experimentalFeatures, // Added
  toggleExperimentalFeature, // Added
  setExperimentalFeatureValue, // Added
  playSound, // Added
}) => {
  
  const effectivelyMaximized = isMaximized || (isMobileView && !isMinimized);

  const { 
    position: currentPosition,
    ref: draggableRef, 
    ...dragEventHandlers 
  } = useDraggable({
    initialPosition,
    initialSize,
    onDrag: (pos) => onDrag(pos),
    onDragStop,
    disabled: effectivelyMaximized,
  });

  const glassIntensity = experimentalFeatures?.glassmorphismIntensity ?? 0.9;
  const windowBgColor = `rgba(30, 41, 59, ${glassIntensity})`; // Dynamic background color

  const windowBaseStyle: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: windowBgColor,
    zIndex,
    transition: 'opacity 0.3s ease, filter 0.3s ease, background-color 0.3s ease', 
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
    contentWithProps = React.cloneElement(children as React.ReactElement<ContentComponentProps>, { 
      openWindow: openApp,
      experimentalFeatures,
      toggleExperimentalFeature,
      setExperimentalFeatureValue,
      playSound,
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
        style={{ backgroundColor: `rgba(30, 41, 59, ${glassIntensity + 0.05 > 1 ? 1 : glassIntensity + 0.05 })` }} // Slightly less transparent title bar
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