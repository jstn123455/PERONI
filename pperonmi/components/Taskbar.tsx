
import React, { useState, useEffect, useRef } from 'react';
import { AppId, NavItem, TaskbarProps, WindowInstance } from '../types'; // Updated import
import HomeIcon from './icons/HomeIcon';
import UserIcon from './icons/UserIcon';
import CodeBracketIcon from './icons/CodeBracketIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import EnvelopeIcon from './icons/EnvelopeIcon';
import CommandLineIcon from './icons/CommandLineIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import PlinkoIcon from './icons/PlinkoIcon';
import FlaskIcon from './icons/FlaskIcon'; // Import FlaskIcon

const appIcons: Record<AppId, React.FC<React.SVGProps<SVGSVGElement>>> = {
  home: HomeIcon,
  about: UserIcon,
  skills: CodeBracketIcon,
  experience: BriefcaseIcon,
  contact: EnvelopeIcon,
  terminal: CommandLineIcon,
  admin: ShieldCheckIcon,
  plinko: PlinkoIcon,
  experimental: FlaskIcon, // Add FlaskIcon for experimental app
};

const Taskbar: React.FC<TaskbarProps> = ({ 
  apps, 
  openWindows, 
  onOpenWindow, 
  onFocusWindow, 
  onMinimizeWindow, 
  isMobileView,
  experimentalFeatures 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const startMenuRef = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);

  const accentColor = experimentalFeatures?.accentColor || '#0ea5e9'; // Default sky-500
  const glassIntensity = experimentalFeatures?.glassmorphismIntensity ?? 0.9;


  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000 * 30); 
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isStartMenuOpen &&
        startMenuRef.current && 
        !startMenuRef.current.contains(event.target as Node) &&
        startButtonRef.current && 
        !startButtonRef.current.contains(event.target as Node) 
      ) {
        setIsStartMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isStartMenuOpen]);

  const startMenuItems: NavItem[] = Object.values(apps).map(app => ({
    name: app.title,
    appId: app.id,
    icon: appIcons[app.id] || HomeIcon, 
  }));

  const handleAppIconClick = (win: WindowInstance) => {
    if (win.isMinimized) {
      onOpenWindow(win.appId); 
    } else {
      const nonMinimizedWindows = openWindows.filter(w => !w.isMinimized);
      const maxZIndex = nonMinimizedWindows.length > 0 ? Math.max(...nonMinimizedWindows.map(w => w.zIndex)) : 0;
      
      if (win.zIndex < maxZIndex || isMobileView || win.isMaximized) { 
         onFocusWindow(win.id);
      } else {
         onMinimizeWindow(win.id);
      }
    }
  };


  return (
    <nav 
      className="h-12 bg-os-title-bar/80 backdrop-blur-md text-slate-200 flex items-center justify-between px-2 shadow-taskbar border-t border-slate-700/50 z-[1000]"
      style={{backgroundColor: `rgba(30, 41, 59, ${glassIntensity})`}}
    >
      {/* Start Menu */}
      <div className="relative" ref={startMenuRef}>
        <button
          ref={startButtonRef}
          onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          className="p-2 rounded hover:bg-os-icon-hover/30 transition-colors"
          aria-expanded={isStartMenuOpen}
          aria-label="Start Menu"
          style={{backgroundColor: isStartMenuOpen ? accentColor : 'transparent'}}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6" style={{color: accentColor}}>
            <path d="M3 3.75A.75.75 0 013.75 3h12.5a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75V3.75zM5.5 6.5A.5.5 0 005 7v1.5a.5.5 0 00.5.5H7a.5.5 0 00.5-.5V7a.5.5 0 00-.5-.5H5.5zM5.5 11.5a.5.5 0 00-.5.5V13a.5.5 0 00.5.5H7a.5.5 0 00.5-.5v-1.5a.5.5 0 00-.5-.5H5.5zM10 6.5a.5.5 0 00-.5.5V8a.5.5 0 00.5.5h1.5a.5.5 0 00.5-.5V7a.5.5 0 00-.5-.5H10zm-.5 5A.5.5 0 009 12v1.5a.5.5 0 00.5.5h1.5a.5.5 0 00.5-.5V12a.5.5 0 00-.5-.5H9.5zM13 6.5a.5.5 0 00-.5.5V8a.5.5 0 00.5.5h1.5a.5.5 0 00.5-.5V7a.5.5 0 00-.5-.5H13zm-.5 5A.5.5 0 0012 12v1.5a.5.5 0 00.5.5h1.5a.5.5 0 00.5-.5V12a.5.5 0 00-.5-.5h-1.5z" />
          </svg>
        </button>
        {isStartMenuOpen && (
          <div 
            className={`absolute left-0 bottom-full mb-2 bg-slate-800/90 backdrop-blur-md rounded-lg shadow-lg border border-slate-700 
            ${isMobileView 
              ? 'w-screen max-w-md p-4 max-h-[70vh] overflow-y-auto transform translate-x-[-8px]'
              : 'w-64 p-2' 
            }`}
             style={{backgroundColor: `rgba(45, 55, 72, ${glassIntensity + 0.05 > 1 ? 0.95 : glassIntensity + 0.05})`}}
          >
            <div className={`text-sm font-semibold px-2 py-1 ${isMobileView ? 'text-base mb-2' : ''}`} style={{color: accentColor}}>Justin Terzoni OS</div>
            {startMenuItems.map((item) => {
              const Icon = item.icon || HomeIcon;
              return (
                <button
                  key={item.appId}
                  onClick={() => {
                    onOpenWindow(item.appId);
                    setIsStartMenuOpen(false);
                  }}
                  className={`w-full flex items-center text-left px-3 py-2 text-slate-200 hover:bg-opacity-30 rounded-md transition-colors
                    ${isMobileView ? 'text-lg py-3' : 'text-sm'}
                  `}
                  style={{'--hover-bg-color': accentColor} as React.CSSProperties}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = `rgba(${parseInt(accentColor.slice(1,3),16)}, ${parseInt(accentColor.slice(3,5),16)}, ${parseInt(accentColor.slice(5,7),16)}, 0.3)`}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isMobileView ? 'w-6 h-6' : ''}`} style={{color: accentColor}} />
                  {item.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {!isMobileView && (
        <div className="flex items-center space-x-1 overflow-x-auto h-full py-1">
          {openWindows.map((win) => {
            const AppSpecificIcon = appIcons[win.appId] || HomeIcon;
            const nonMinimizedWindows = openWindows.filter(w => !w.isMinimized);
            const maxZ = nonMinimizedWindows.length > 0 ? Math.max(...nonMinimizedWindows.filter(w => w.zIndex !== undefined).map(w => w.zIndex)) : 0;
            const isActive = !win.isMinimized && win.zIndex === maxZ;
            
            const activeStyle = isActive ? { backgroundColor: `rgba(${parseInt(accentColor.slice(1,3),16)}, ${parseInt(accentColor.slice(3,5),16)}, ${parseInt(accentColor.slice(5,7),16)}, 0.5)`, color: 'white' } : {};
            const minimizedStyle = win.isMinimized ? { borderBottom: `2px solid ${accentColor}`, opacity: 0.7 } : {};

            return (
              <button
                key={win.id}
                onClick={() => handleAppIconClick(win)}
                className={`h-full flex items-center px-3 py-1 rounded-md transition-colors hover:bg-slate-700/70`}
                style={{...activeStyle, ...minimizedStyle}}
                title={win.title}
              >
                <AppSpecificIcon className="w-5 h-5 mr-1" style={{color: accentColor, opacity: 0.8}} />
                <span className="text-xs truncate max-w-[80px]">{win.title}</span>
              </button>
            );
          })}
        </div>
      )}
      
      {isMobileView && <div className="flex-grow"></div>} {/* Spacer for mobile */}

      <div className="text-xs px-2 text-slate-400">
        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </nav>
  );
};

export default Taskbar;