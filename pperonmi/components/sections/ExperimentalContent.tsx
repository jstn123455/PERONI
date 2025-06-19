import React from 'react';
import { ContentComponentProps, ExperimentalFeaturesState } from '../../types';

const ExperimentalContent: React.FC<ContentComponentProps> = ({
  experimentalFeatures,
  toggleExperimentalFeature,
  setExperimentalFeatureValue,
  playSound,
}) => {
  if (!experimentalFeatures || !toggleExperimentalFeature || !setExperimentalFeatureValue) {
    return (
      <div className="p-4 text-slate-400">
        Experimental features are not available at the moment.
      </div>
    );
  }

  const handleToggle = (feature: keyof ExperimentalFeaturesState) => {
    toggleExperimentalFeature(feature);
    playSound?.('click');
  };

  const handleValueChange = (
    feature: keyof ExperimentalFeaturesState,
    value: any
  ) => {
    setExperimentalFeatureValue(feature, value);
    playSound?.('notify');
  };
  
  const commonInputClass = "mt-1 block w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100";
  const labelClass = "block text-sm font-medium text-slate-300";
  const sectionSpacing = "space-y-4";
  const controlGroupClass = "p-3 bg-slate-800/50 rounded-lg";

  return (
    <div className={`p-4 space-y-6 text-slate-200 ${sectionSpacing}`}>
      <h2 className="text-xl font-semibold text-slate-100 border-b border-slate-700 pb-2">
        Experimental Features Lab
      </h2>

      <div className={controlGroupClass}>
        <h3 className="text-md font-medium text-sky-400 mb-2">Feature Toggles</h3>
        <div className="space-y-3">
          {(['typingParticleBurst', 'personalizedGreeting', 'uiSoundEffects'] as const).map(featureKey => (
            <label key={featureKey} htmlFor={featureKey} className="flex items-center justify-between cursor-pointer p-2 rounded-md hover:bg-slate-700/30 transition-colors">
              <span className={labelClass}>
                {featureKey === 'typingParticleBurst' && 'Typing Particle Burst (Terminal)'}
                {featureKey === 'personalizedGreeting' && 'Personalized MOTD (Terminal)'}
                {featureKey === 'uiSoundEffects' && 'UI Sound Effects'}
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  id={featureKey}
                  className="sr-only peer"
                  checked={!!experimentalFeatures[featureKey]}
                  onChange={() => handleToggle(featureKey)}
                />
                <div className="block bg-slate-600 w-10 h-6 rounded-full peer-checked:bg-sky-500 transition-colors"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
              </div>
            </label>
          ))}
        </div>
      </div>
      
      <div className={controlGroupClass}>
        <h3 className="text-md font-medium text-sky-400 mb-3">UI Customization</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="accentColor" className={`${labelClass} mb-1`}>UI Accent Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                id="accentColor"
                value={experimentalFeatures.accentColor || '#0ea5e9'}
                onChange={(e) => handleValueChange('accentColor', e.target.value)}
                className="w-10 h-10 p-0 border-none rounded cursor-pointer bg-slate-700"
              />
              <input 
                type="text"
                value={experimentalFeatures.accentColor || '#0ea5e9'}
                onChange={(e) => handleValueChange('accentColor', e.target.value)}
                className={`${commonInputClass} w-auto flex-grow`}
                placeholder="#0ea5e9"
              />
            </div>
          </div>

          <div>
            <label htmlFor="uiFont" className={`${labelClass} mb-1`}>UI Font Family</label>
            <input
              type="text"
              id="uiFont"
              value={experimentalFeatures.uiFont || ''}
              onChange={(e) => handleValueChange('uiFont', e.target.value)}
              className={commonInputClass}
              placeholder="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ..."
            />
          </div>

          <div>
            <label className={`${labelClass} mb-1`}>UI Density</label>
            <div className="flex space-x-2">
              {(['compact', 'comfortable', 'spacious'] as const).map(density => (
                <button
                  key={density}
                  onClick={() => handleValueChange('uiDensity', density)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-700 focus:ring-sky-400
                    ${experimentalFeatures.uiDensity === density ? 'bg-sky-500 text-white' : 'bg-slate-600 hover:bg-slate-500 text-slate-300'}`}
                >
                  {density.charAt(0).toUpperCase() + density.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="glassmorphismIntensity" className={`${labelClass} mb-1`}>
              Window Glassmorphism Intensity: {Number(experimentalFeatures.glassmorphismIntensity || 0.9).toFixed(2)}
            </label>
            <input
              type="range"
              id="glassmorphismIntensity"
              min="0.1" max="1.0" step="0.05"
              value={experimentalFeatures.glassmorphismIntensity || 0.9}
              onChange={(e) => handleValueChange('glassmorphismIntensity', parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
          </div>
        </div>
      </div>
       <p className="text-xs text-slate-500 mt-4 text-center">
        Changes are applied live. Some features may require app/window restart to fully take effect.
      </p>
    </div>
  );
};

export default ExperimentalContent;
