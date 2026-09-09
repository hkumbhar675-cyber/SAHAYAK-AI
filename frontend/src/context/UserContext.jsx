import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const DEMO_CITIZENS = [
  {
    id: 1,
    name: 'Ramesh Tukaram Patil',
    phone: '+91 98220 12345',
    email: 'ramesh.patil@example.in',
    age: 38,
    gender: 'Male',
    occupation: 'Farmer',
    category: 'OBC',
    annual_income: 220000,
    district: 'Pune',
    state: 'Maharashtra',
    landholding_acres: 3.5,
    avatar: '👨‍🌾',
    badge: 'Farmer (3.5 Acres)'
  },
  {
    id: 2,
    name: 'Priya Santosh Sharma',
    phone: '+91 98220 54321',
    email: 'priya.sharma@example.in',
    age: 29,
    gender: 'Female',
    occupation: 'Small Business',
    category: 'General',
    annual_income: 380000,
    district: 'Pune',
    state: 'Maharashtra',
    landholding_acres: 0,
    avatar: '👩‍💼',
    badge: 'Small Business'
  },
  {
    id: 3,
    name: 'Amit Vasant Shinde',
    phone: '+91 98220 98765',
    email: 'amit.shinde@example.in',
    age: 24,
    gender: 'Male',
    occupation: 'Student / Graduate',
    category: 'SC',
    annual_income: 120000,
    district: 'Pune',
    state: 'Maharashtra',
    landholding_acres: 0,
    avatar: '👨‍🎓',
    badge: 'Graduate / Youth'
  },
  {
    id: 4,
    name: 'Sunita Eknath Gaikwad',
    phone: '+91 98220 11223',
    email: 'sunita.gaikwad@example.in',
    age: 34,
    gender: 'Female',
    occupation: 'Artisan / Weaver',
    category: 'Women',
    annual_income: 180000,
    district: 'Pune',
    state: 'Maharashtra',
    landholding_acres: 0,
    avatar: '👩‍🎨',
    badge: 'Artisan & Weaver'
  },
  {
    id: 5,
    name: 'Suresh Babu Tambe',
    phone: '+91 98220 33445',
    email: 'suresh.tambe@example.in',
    age: 46,
    gender: 'Male',
    occupation: 'Street Vendor',
    category: 'OBC',
    annual_income: 150000,
    district: 'Pune',
    state: 'Maharashtra',
    landholding_acres: 0,
    avatar: '🛒',
    badge: 'Street Vendor'
  }
];

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(DEMO_CITIZENS[0]);
  const [citizens, setCitizens] = useState(DEMO_CITIZENS);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const selectUser = (userId) => {
    const user = citizens.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const updateUser = (updatedFields) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updatedFields
    }));
  };

  return (
    <UserContext.Provider value={{
      currentUser,
      citizens,
      selectUser,
      updateUser,
      isLoginModalOpen,
      setIsLoginModalOpen
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
