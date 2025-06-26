
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '@/components/TopNavbar';
import BottomNavbar from '@/components/BottomNavbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { LogOut, Camera, User as UserIcon, Mail } from 'lucide-react';

const User = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      toast({ title: "Logged out successfully" });
      navigate('/login');
    } catch (error) {
      toast({ title: "Error logging out", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const randomAvatars = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopNavbar title="Profile" />
      
      <div className="p-4 space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={user?.photoURL || ''} />
                <AvatarFallback className="bg-blue-500 text-white text-2xl">
                  {user?.email ? getInitials(user.email) : 'U'}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full text-white shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {user?.displayName || 'User'}
            </h2>
            <p className="text-gray-600 mb-4">{user?.email}</p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Habit Tracker Pro
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Profile Pictures</h3>
            <div className="grid grid-cols-5 gap-3">
              {randomAvatars.map((avatar, index) => (
                <button
                  key={index}
                  className="aspect-square rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors"
                >
                  <img 
                    src={avatar} 
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              Tap to change your profile picture
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-gray-800">Account Information</h3>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <UserIcon className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-800">Display Name</p>
                <p className="text-sm text-gray-600">{user?.displayName || 'Not set'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-800">Email</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600">Habits Completed</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full h-12"
          disabled={loading}
        >
          <LogOut className="w-5 h-5 mr-2" />
          {loading ? 'Logging out...' : 'Logout'}
        </Button>
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default User;
