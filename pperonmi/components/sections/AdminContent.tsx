import React, { useState, useEffect } from 'react';
import { ContactFormData } from '../../types';

const ADMIN_USERNAME = 'terzoni'; // Updated username
const ADMIN_PASSWORD = '190509'; // Updated password

const AdminContent: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [contacts, setContacts] = useState<ContactFormData[]>([]);

  const fetchContacts = () => {
    try {
      const storedContacts = localStorage.getItem('contactSubmissions');
      if (storedContacts) {
        setContacts(JSON.parse(storedContacts));
      } else {
        setContacts([]);
      }
    } catch (e) {
      console.error("Error fetching contacts from localStorage:", e);
      setContacts([]);
      setError("Could not load contact data.");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchContacts();
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      setError('');
      setUsername('');
      setPassword('');
    } else {
      setError('Invalid username or password.');
      setIsLoggedIn(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setContacts([]);
  };

  const handleClearContacts = () => {
    if (window.confirm("Are you sure you want to delete all contact submissions? This cannot be undone.")) {
      try {
        localStorage.removeItem('contactSubmissions');
        setContacts([]);
        alert("All contacts cleared.");
      } catch (e) {
        console.error("Error clearing contacts from localStorage:", e);
        setError("Could not clear contacts.");
      }
    }
  };


  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <h2 className="text-xl font-semibold text-slate-100 mb-6">Admin Login</h2>
        <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
          <div>
            <label htmlFor="username-admin" className="block text-xs font-medium text-slate-300">Username</label>
            <input
              type="text"
              id="username-admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"
              required
            />
          </div>
          <div>
            <label htmlFor="password-admin" className="block text-xs font-medium text-slate-300">Password</label>
            <input
              type="password"
              id="password-admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-slate-700/60 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"
              required
            />
          </div>
          {error && <p className="text-red-400 text-xs" role="alert">{error}</p>}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-900"
          >
            Login
          </button>
        </form>
        {/* Demo credentials hint removed */}
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-300 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-100">Contact Submissions</h2>
        <div>
          <button
            onClick={handleClearContacts}
            className="mr-2 px-3 py-1 border border-red-500 text-xs font-medium rounded-md text-red-400 bg-transparent hover:bg-red-500 hover:text-slate-900 transition-colors"
          >
            Clear All Contacts
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1 border border-sky-500 text-xs font-medium rounded-md text-sky-400 bg-transparent hover:bg-sky-500 hover:text-slate-900 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {error && <p className="text-red-400 text-xs mb-2" role="alert">{error}</p>}
      
      {contacts.length === 0 ? (
        <p>No contact submissions found.</p>
      ) : (
        <div className="flex-grow overflow-y-auto">
          <ul className="space-y-4">
            {contacts.slice().reverse().map((contact, index) => ( // Show newest first
              <li key={index} className="bg-slate-700/50 p-3 rounded-md shadow">
                <div className="flex justify-between items-start mb-1">
                  <strong className="text-sky-300 text-sm">{contact.name}</strong>
                  <span className="text-xs text-slate-400">
                    {new Date(contact.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-1 break-words">Email: {contact.email}</p>
                <p className="text-sm mt-1 whitespace-pre-wrap break-words">{contact.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
       <p className="mt-4 text-xs text-slate-500 text-center">
        Contact data is stored in browser localStorage for demonstration purposes. This is not secure for production.
      </p>
    </div>
  );
};

export default AdminContent;