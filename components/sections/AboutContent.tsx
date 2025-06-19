
import React from 'react';

const AboutContent: React.FC = () => {
  return (
    <div className="space-y-6 text-slate-300">
      <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-6">
        <img 
          src="https://picsum.photos/seed/justin-profile/200/200" 
          alt="Justin Terzoni" 
          className="rounded-full w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-cover shadow-lg border-2 border-sky-500/50 flex-shrink-0" 
        />
        <div className="text-sm md:text-base">
          <p>
            Hi, I'm Justin Terzoni, a 16-year-old passionate full-stack developer with an insatiable curiosity for technology and a drive to build impactful digital solutions. My journey into the world of coding started early, fueled by a fascination with how software shapes our world.
          </p>
        </div>
      </div>
      <p className="text-sm md:text-base">
        I thrive on challenges and continuously explore new languages, frameworks, and methodologies. From designing intuitive user interfaces with React and Vue.js to architecting robust backend systems with Node.js and Python, I enjoy every aspect of the development lifecycle.
      </p>
      <p className="text-sm md:text-base">
        My key strengths include problem-solving, a keen eye for detail, and a collaborative spirit. I'm always eager to learn and contribute to projects that make a difference. When I'm not coding, you might find me exploring new tech trends, contributing to open-source projects, or gaming.
      </p>
    </div>
  );
};

export default AboutContent;
