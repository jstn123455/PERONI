
import React from 'react';

export type AppId = 'home' | 'about' | 'skills' | 'experience' | 'contact' | 'terminal' | 'admin' | 'plinko' | 'experimental';

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface ExperimentalFeaturesState {
  typingParticleBurst?: boolean;
  personalizedGreeting?: boolean;
  uiSoundEffects?: boolean;
  accentColor?: string;
  uiFont?: string;
  uiDensity?: 'compact' | 'comfortable' | 'spacious';
  glassmorphismIntensity?: number;
}

export interface ContentComponentProps {
  openWindow?: (appId: AppId) => void;
  experimentalFeatures?: ExperimentalFeaturesState;
  toggleExperimentalFeature?: (feature: keyof ExperimentalFeaturesState) => void;
  setExperimentalFeatureValue?: (feature: keyof ExperimentalFeaturesState, value: any) => void;
  playSound?: (soundId: string) => void;
}

export interface WindowConfig {
  id: AppId;
  title: string;
  content: React.FC<ContentComponentProps>; 
  initialPosition: WindowPosition;
  initialSize: WindowSize;
  isTerminal?: boolean;
}

export interface WindowInstance {
  id: string; 
  appId: AppId; 
  title: string;
  content: React.FC<ContentComponentProps>;
  position: WindowPosition;
  size: WindowSize;
  prevPosition?: WindowPosition; 
  prevSize?: WindowSize;       
  zIndex: number;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isTerminal?: boolean;
}

export enum SkillCategory {
  FRONTEND = "Frontend",
  BACKEND = "Backend",
  DATABASES = "Databases",
  TOOLS = "Tools & Technologies"
}

export interface Skill {
  name: string;
  category: SkillCategory;
  icon?: React.ReactNode;
}

export interface NavItem {
  name: string;
  appId: AppId;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export interface TerminalCommand {
  command: string;
  description: string;
  action: (
    args: string[],
    openWindow?: (appId: AppId) => void
  ) => string | void | Promise<string | void>;
}

export interface ContactFormData {
  name:string;
  email: string;
  message: string;
  timestamp: string;
}

// Plinko Game Types
export interface PlinkoPeg {
  id: string;
  x: number;
  y: number;
  radius: number;
}

export interface PlinkoPuck {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  active: boolean; 
}

export interface PlinkoSlot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  value: number; 
  color: string;
}

export type PlinkoGameState = 'IDLE' | 'DROPPING' | 'LANDED';
