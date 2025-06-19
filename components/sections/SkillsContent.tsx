import React from 'react';
import { Skill, SkillCategory } from '../../types';
import SkillBadge from '../SkillBadge'; // Assuming SkillBadge is in components folder

const skillsData: Skill[] = [
  // Frontend
  { name: 'JavaScript (ES6+)', category: SkillCategory.FRONTEND }, { name: 'TypeScript', category: SkillCategory.FRONTEND },
  { name: 'React', category: SkillCategory.FRONTEND }, { name: 'Next.js', category: SkillCategory.FRONTEND },
  { name: 'Vue.js', category: SkillCategory.FRONTEND }, { name: 'HTML5', category: SkillCategory.FRONTEND },
  { name: 'CSS3', category: SkillCategory.FRONTEND }, { name: 'Tailwind CSS', category: SkillCategory.FRONTEND },
  { name: 'Redux', category: SkillCategory.FRONTEND },
  // Backend
  { name: 'Node.js', category: SkillCategory.BACKEND }, { name: 'Express.js', category: SkillCategory.BACKEND },
  { name: 'Python', category: SkillCategory.BACKEND }, { name: 'Flask', category: SkillCategory.BACKEND },
  { name: 'Django', category: SkillCategory.BACKEND }, { name: 'REST APIs', category: SkillCategory.BACKEND },
  { name: 'GraphQL', category: SkillCategory.BACKEND },
  // Databases
  { name: 'MongoDB', category: SkillCategory.DATABASES }, { name: 'PostgreSQL', category: SkillCategory.DATABASES },
  { name: 'MySQL', category: SkillCategory.DATABASES }, { name: 'Firebase', category: SkillCategory.DATABASES },
  // Tools & Technologies
  { name: 'Git & GitHub', category: SkillCategory.TOOLS }, { name: 'Docker', category: SkillCategory.TOOLS },
  { name: 'Webpack', category: SkillCategory.TOOLS }, { name: 'Jest', category: SkillCategory.TOOLS },
  { name: 'CI/CD', category: SkillCategory.TOOLS }, { name: 'VS Code', category: SkillCategory.TOOLS },
  { name: 'Linux', category: SkillCategory.TOOLS },
];

const SkillsContent: React.FC = () => {
  const categorizedSkills = skillsData.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<SkillCategory, Skill[]>);

  return (
    <div className="space-y-8">
      {Object.entries(categorizedSkills).map(([category, skills]) => (
        <div key={category}>
          <h3 className="text-xl font-semibold text-slate-100 mb-4 border-b border-sky-500/30 pb-1">
            {category}
          </h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <SkillBadge key={skill.name} skill={skill} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillsContent;
