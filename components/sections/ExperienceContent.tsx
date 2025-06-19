import React from 'react';

const ExperienceContent: React.FC = () => {
  return (
    <div className="text-slate-300 space-y-6 text-sm md:text-base">
      <p>
        Ciao! I'm a <strong>16-year-old developer from Italy</strong>, and I've been passionately immersed in the world of coding since I was 14. What began as a spark of curiosity two years ago has blossomed into a dedicated pursuit of crafting elegant, functional, and innovative digital experiences.
      </p>
      
      <div>
        <h3 className="text-lg font-semibold text-sky-300 mb-2">Full-Stack Prowess</h3>
        <p>
          My expertise spans the entire development spectrum. On the <strong className="text-sky-300/90">frontend</strong>, I specialize in creating engaging and responsive user interfaces. I leverage modern JavaScript frameworks like <strong className="text-sky-300/90">React, Next.js, and Vue.js</strong>, complemented by <strong className="text-sky-300/90">TypeScript, HTML5, CSS3, and Tailwind CSS</strong>. My focus is always on building intuitive user experiences that are not only visually appealing but also highly performant and accessible.
        </p>
      </div>

      <div>
        <p className="mt-3">
          When it comes to the <strong className="text-sky-300/90">backend</strong>, I architect and implement robust, scalable server-side applications. I'm proficient with <strong className="text-sky-300/90">Node.js (using Express.js) and Python (with Flask and Django)</strong>. This includes designing efficient <strong className="text-sky-300/90">RESTful APIs</strong>, managing various databases such as <strong className="text-sky-300/90">MongoDB, PostgreSQL, and MySQL</strong>, and ensuring data integrity and security are paramount.
        </p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-sky-300 mb-2 mt-4">My Approach</h3>
        <p>
          Beyond specific technologies, I embrace best practices like version control with <strong className="text-sky-300/90">Git & GitHub</strong> and containerization with <strong className="text-sky-300/90">Docker</strong>. I am familiar with <strong className="text-sky-300/90">CI/CD principles</strong> and strive to write clean, well-documented, and maintainable code. I'm not just a coder; I consider myself a creative problem-solver and a lifelong learner.
        </p>
      </div>

      <p className="mt-4 text-center font-medium text-sky-400/90">
        I'm excited by new challenges and eager to contribute my skills to innovative projects. Let's build something amazing together!
      </p>
    </div>
  );
};

export default ExperienceContent;
