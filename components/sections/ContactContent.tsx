import React, { useState } from 'react';
import GithubIcon from '../icons/GithubIcon';
import LinkedinIcon from '../icons/LinkedinIcon';
import { ContactFormData } from '../../types';

const ContactContent: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitted(false);

    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Please enter a valid email address.');
        return;
    }

    // Store in localStorage
    try {
      const newSubmission: ContactFormData = {
        ...formData,
        timestamp: new Date().toISOString(),
      };
      const existingSubmissionsRaw = localStorage.getItem('contactSubmissions');
      const existingSubmissions: ContactFormData[] = existingSubmissionsRaw ? JSON.parse(existingSubmissionsRaw) : [];
      existingSubmissions.push(newSubmission);
      localStorage.setItem('contactSubmissions', JSON.stringify(existingSubmissions));
      
      console.log('Form data submitted and stored:', newSubmission); 
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      // setTimeout(() => setIsSubmitted(false), 5000); // Auto-hide message
    } catch (storageError) {
      console.error("Error saving to localStorage:", storageError);
      setError("Could not save your message. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-center text-slate-300 text-sm md:text-base">
        Have a project in mind, a question, or just want to say hi? Feel free to reach out!
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name-contact" className="block text-xs font-medium text-slate-300">Full Name</label>
          <input
            type="text" name="name" id="name-contact" value={formData.name} onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"
            placeholder="Your Name"
            aria-required="true"
          />
        </div>
        <div>
          <label htmlFor="email-contact" className="block text-xs font-medium text-slate-300">Email Address</label>
          <input
            type="email" name="email" id="email-contact" value={formData.email} onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"
            placeholder="you@example.com"
            aria-required="true"
          />
        </div>
        <div>
          <label htmlFor="message-contact" className="block text-xs font-medium text-slate-300">Message</label>
          <textarea
            name="message" id="message-contact" rows={3} value={formData.message} onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"
            placeholder="Your message..."
            aria-required="true"
          />
        </div>
        
        {error && <p className="text-red-400 text-xs" role="alert">{error}</p>}
        {isSubmitted && <p className="text-green-400 text-xs" role="status">Thank you for your message! It has been (simulated) stored.</p>}

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-900 transition-transform transform hover:scale-105"
          >
            Send Message
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-slate-400 text-xs mb-2">Or find me on:</p>
        <div className="flex justify-center space-x-4">
          <a href="https://github.com/justin-terzoni-example" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-400 transition-transform transform hover:scale-110" aria-label="GitHub Profile">
            <GithubIcon className="w-6 h-6" />
          </a>
          <a href="https://linkedin.com/in/justin-terzoni-example" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-400 transition-transform transform hover:scale-110" aria-label="LinkedIn Profile">
            <LinkedinIcon className="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactContent;