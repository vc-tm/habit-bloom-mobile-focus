
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import TopNavbar from '@/components/TopNavbar';
import BottomNavbar from '@/components/BottomNavbar';
import AnimatedCheckbox from '@/components/AnimatedCheckbox';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekdays' | 'specific';
  completedDates: string[];
  weekdays?: number[];
  specificDate?: string;
}

const Home = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    fetchTodayHabits();
  }, [user]);

  const fetchTodayHabits = async () => {
    if (!user) return;
    
    try {
      const habitsRef = collection(db, 'habits');
      const q = query(habitsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const todayHabits: Habit[] = [];
      const currentDay = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
      
      querySnapshot.forEach((doc) => {
        const habitData = doc.data() as Omit<Habit, 'id'>;
        const habit = { id: doc.id, ...habitData };
        
        // Check if habit should be shown today
        let showToday = false;
        
        if (habit.frequency === 'daily') {
          showToday = true;
        } else if (habit.frequency === 'weekdays' && habit.weekdays) {
          showToday = habit.weekdays.includes(currentDay);
        } else if (habit.frequency === 'specific' && habit.specificDate) {
          showToday = habit.specificDate === today;
        }
        
        if (showToday) {
          todayHabits.push(habit);
        }
      });
      
      setHabits(todayHabits);
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast({ title: "Error fetching habits", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const toggleHabitCompletion = async (habitId: string, completed: boolean) => {
    try {
      const habitRef = doc(db, 'habits', habitId);
      const habit = habits.find(h => h.id === habitId);
      
      if (!habit) return;
      
      let updatedCompletedDates = [...habit.completedDates];
      
      if (completed) {
        if (!updatedCompletedDates.includes(today)) {
          updatedCompletedDates.push(today);
        }
      } else {
        updatedCompletedDates = updatedCompletedDates.filter(date => date !== today);
      }
      
      await updateDoc(habitRef, {
        completedDates: updatedCompletedDates
      });
      
      setHabits(habits.map(h => 
        h.id === habitId 
          ? { ...h, completedDates: updatedCompletedDates }
          : h
      ));
      
      toast({ 
        title: completed ? "Great job! 🎉" : "Habit unmarked",
        description: completed ? "Keep up the good work!" : ""
      });
    } catch (error) {
      console.error('Error updating habit:', error);
      toast({ title: "Error updating habit", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopNavbar title="Today's Habits" />
      
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {format(new Date(), 'EEEE, MMMM d')}
          </h2>
          <p className="text-gray-600">
            {habits.length === 0 
              ? "No habits for today. Add some to get started!" 
              : `${habits.filter(h => h.completedDates.includes(today)).length} of ${habits.length} completed`
            }
          </p>
        </div>
        
        <div className="space-y-3">
          {habits.map((habit) => {
            const isCompleted = habit.completedDates.includes(today);
            
            return (
              <div
                key={habit.id}
                className={`bg-white rounded-lg p-4 shadow-sm border transition-all duration-200 ${
                  isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      isCompleted ? 'text-green-800 line-through' : 'text-gray-800'
                    }`}>
                      {habit.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {habit.frequency === 'daily' && 'Daily'}
                      {habit.frequency === 'weekdays' && 'Weekdays only'}
                      {habit.frequency === 'specific' && 'Specific date'}
                    </p>
                  </div>
                  <AnimatedCheckbox
                    checked={isCompleted}
                    onChange={(checked) => toggleHabitCompletion(habit.id, checked)}
                    size="lg"
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        {habits.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No habits for today</h3>
            <p className="text-gray-600 mb-6">Start building better habits by adding your first one!</p>
          </div>
        )}
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default Home;
