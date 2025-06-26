
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const TopNavbar = ({ title }: { title: string }) => {
  const { user } = useAuth();
  
  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      <Avatar className="w-10 h-10">
        <AvatarImage src={user?.photoURL || ''} />
        <AvatarFallback className="bg-blue-500 text-white text-sm">
          {user?.email ? getInitials(user.email) : 'U'}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default TopNavbar;
