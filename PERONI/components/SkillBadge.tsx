import React from 'react';
import { Skill } from '../types';

interface SkillBadgeProps {
  skill: Skill;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill }) => {
  return (
    <div 
      className="bg-slate-700/80 text-sky-300 px-3 py-1 rounded-md text-sm font-medium shadow-sm hover:bg-slate-600/90 transition-all duration-200 cursor-default"
    >
      {skill.name}
    </div>
  );
};

export default SkillBadge;