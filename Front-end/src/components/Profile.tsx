import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'react-calendar/dist/Calendar.css';
import '../styles/calendar.css'; 


const Profile: React.FC = () => {
  fetch('/api/current_user', { credentials: 'include' })
  // Editable state for each field
  const [name, setName] = useState(localStorage.getItem('name') || '');
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePic') || '');
  const [dob, setDob] = useState(localStorage.getItem('dob') || '');
  const [weight, setWeight] = useState(localStorage.getItem('weight') || '');
  const [height, setHeight] = useState(localStorage.getItem('height') || '');
  const [contact, setContact] = useState(localStorage.getItem('contact') || '');
  const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

  // Handle profile picture upload
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [completedDates, setCompletedDates] = useState<string[]>([]);

  useEffect(() => {
  // Fetch completed workout dates from backend on mount
  const fetchCompleted = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/workout_completed', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.status === 'success' && Array.isArray(data.dates)) {
        setCompletedDates(data.dates);
      }
    } catch (error) {
      // Optionally log the error or handle it as needed
      console.error('Failed to fetch completed workout dates:', error);
    }
  };
  fetchCompleted();
}, [token]);

const handleDateClick = async (date: Date) => {
  const dateStr = date.toISOString().split('T')[0];
  try {
    const res = await fetch('http://localhost:5000/api/workout_complete', {
      method: 'POST',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date: dateStr }),
    });
    const data = await res.json();
    if (data.status === 'success') {
      setCompletedDates((prev) => [...new Set([...prev, dateStr])]);
      setMessage('Workout marked as completed!');
      setTimeout(() => setMessage(''), 2000);
    }
  } catch {
    setMessage('Failed to mark workout.');
    setTimeout(() => setMessage(''), 2000);
  }
};
   useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
       const res = await fetch('http://localhost:5000/api/current_user', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (data.status === 'success' && data.user) {
          setName(data.user.name || '');
          setEmail(data.user.email || '');
          setProfilePic(data.user.profilePic || '');
          setDob(data.user.dob || '');
          setWeight(data.user.weight || '');
          setHeight(data.user.height || '');
          setContact(data.user.contact || '');
        } else {
          setMessage(data.message || 'Failed to load user');
        }
      } catch (err) {
        setMessage('Error loading profile');
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  // Save all details to localStorage
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('name', name);
    localStorage.setItem('email', email);
    localStorage.setItem('profilePic', profilePic);
    localStorage.setItem('dob', dob);
    localStorage.setItem('weight', weight);
    localStorage.setItem('height', height);
    localStorage.setItem('contact', contact);
    setMessage('Profile updated!');
    setTimeout(() => setMessage(''), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden"
      style={{
        // Example background image with overlay
        backgroundImage: `
          linear-gradient(rgba(17,24,39,0.92), rgba(17,24,39,0.92)),
          url('https://www.nebraskamed.com/sites/default/files/images/weight-loss/AtHomeExercise_OpenGraph.png')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-500 rounded-full opacity-20 blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-500 rounded-full opacity-20 blur-3xl -z-10"></div>
      <form
        className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-2xl relative z-10" 
        onSubmit={handleSave}
        autoComplete="off"
      >
        <h2 className="text-3xl font-bold text-orange-500 mb-6 text-center">Profile</h2>
        <div className="flex flex-col items-center mb-6">
          <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mb-3">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-5xl text-gray-500">👤</span>
            )}
          </div>
          <label className="text-xs text-orange-400 hover:underline mb-2 cursor-pointer">
            Change Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePicChange}
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-1">Full Name</label>
          <input
            type="text"
            className="w-full bg-gray-700 rounded px-4 py-2 text-white"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-1">Email</label>
          <input
            type="email"
            className="w-full bg-gray-700 rounded px-4 py-2 text-white"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-1">Date of Birth</label>
          <input
            type="date"
            className="w-full bg-gray-700 rounded px-4 py-2 text-white"
            value={dob}
            onChange={e => setDob(e.target.value)}
          />
        </div>
        <div className="mb-4 flex space-x-4">
          <div className="flex-1">
            <label className="block text-gray-400 text-sm mb-1">Weight (kg)</label>
            <input
              type="number"
              className="w-full bg-gray-700 rounded px-4 py-2 text-white"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              min="0"
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-400 text-sm mb-1">Height (cm)</label>
            <input
              type="number"
              className="w-full bg-gray-700 rounded px-4 py-2 text-white"
              value={height}
              onChange={e => setHeight(e.target.value)}
              min="0"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-1">Contact Number</label>
          <input
            type="tel"
            className="w-full bg-gray-700 rounded px-4 py-2 text-white"
            value={contact}
            onChange={e => setContact(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded transition-colors"
        >
          Save
        </button>
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl mt-10 max-w-2xl mx-auto border border-orange-500">
          <h3 className="text-xl font-bold text-orange-400 mb-4 text-center">Workout Calendar</h3>
          <Calendar
            onClickDay={handleDateClick}
            tileClassName={({ date }) =>
              completedDates.includes(date.toISOString().split('T')[0])
                ? 'bg-orange-500 text-white rounded-full'
                : undefined
            }
          />
          <div className="text-gray-400 text-sm mt-2 text-center">
            Click a date to mark your workout as completed!
          </div>
        </div>
        {message && (
          <div className="text-green-400 text-center mt-4">{message}</div>
        )}
      </form>
    </div>
  );
};

export default Profile;