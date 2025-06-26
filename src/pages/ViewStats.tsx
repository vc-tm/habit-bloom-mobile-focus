
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import TopNavbar from '@/components/TopNavbar';
import BottomNavbar from '@/components/BottomNavbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getYear, getMonth, subMonths } from 'date-fns';

interface Habit {
  id: string;
  name: string;
  completedDates: string[];
}

const ViewStats = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [expandedHabits, setExpandedHabits] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchHabits();
  }, [user]);

  const fetchHabits = async () => {
    if (!user) return;
    
    try {
      setError(null);
      console.log('Fetching habits for user:', user.uid);
      
      const habitsRef = collection(db, 'habits');
      const q = query(habitsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const habitsList: Habit[] = [];
      querySnapshot.forEach((doc) => {
        const habitData = doc.data();
        habitsList.push({
          id: doc.id,
          name: habitData.name,
          completedDates: habitData.completedDates || []
        });
      });
      
      console.log('Fetched habits:', habitsList.length);
      setHabits(habitsList);
    } catch (error) {
      console.error('Error fetching habits:', error);
      setError('Failed to load habits. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleHabitView = (habitId: string) => {
    setExpandedHabits(prev => {
      const newSet = new Set(prev);
      if (newSet.has(habitId)) {
        newSet.delete(habitId);
      } else {
        newSet.add(habitId);
      }
      return newSet;
    });
  };

  const renderCalendar = (habit: Habit, monthsBack: number = 0) => {
    const today = new Date();
    const targetMonth = monthsBack === 0 ? today : subMonths(today, monthsBack);
    const monthStart = startOfMonth(targetMonth);
    const monthEnd = endOfMonth(targetMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    const startPadding = monthStart.getDay();
    const paddingDays = Array.from({ length: startPadding }, (_, i) => null);
    
    return (
      <div className="mt-4" key={`calendar-${habit.id}-${monthsBack}`}>
        <h4 className="font-medium mb-3 text-center">
          {format(targetMonth, 'MMMM yyyy')}
        </h4>
        <div className="grid grid-cols-7 gap-1 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-xs font-semibold text-gray-500 p-2">
              {day}
            </div>
          ))}
          
          {paddingDays.map((_, index) => (
            <div key={`padding-${index}`} className="p-2"></div>
          ))}
          
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isCompleted = habit.completedDates.includes(dateStr);
            const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
            
            return (
              <div
                key={dateStr}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium m-1
                  ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}
                  ${isToday ? 'ring-2 ring-blue-500' : ''}
                `}
              >
                {format(day, 'd')}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your stats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <TopNavbar title="Habit Statistics" />
        <div className="p-4 flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Stats</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchHabits}>Try Again</Button>
          </div>
        </div>
        <BottomNavbar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopNavbar title="Habit Statistics" />
      
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Progress</h2>
          <p className="text-gray-600">Track your consistency and celebrate your wins!</p>
        </div>
        
        <div className="space-y-4">
          {habits.map((habit) => {
            const isExpanded = expandedHabits.has(habit.id);
            const thisMonthCompleted = habit.completedDates.filter(date => {
              const completedDate = new Date(date);
              const today = new Date();
              return getYear(completedDate) === getYear(today) && 
                     getMonth(completedDate) === getMonth(today);
            }).length;
            
            return (
              <Card key={habit.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">{habit.name}</h3>
                      <p className="text-sm text-gray-600">
                        {thisMonthCompleted} days completed this month
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleHabitView(habit.id)}
                    >
                      {isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                  </div>
                  
                  {renderCalendar(habit, 0)}
                  
                  {isExpanded && (
                    <div className="mt-6 pt-4 border-t">
                      <h4 className="font-medium mb-4 text-center text-gray-700">
                        Previous Months
                      </h4>
                      <div className="max-h-96 overflow-y-auto space-y-4">
                        {Array.from({ length: 6 }, (_, i) => 
                          renderCalendar(habit, i + 1)
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {habits.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No habits to track yet</h3>
            <p className="text-gray-600">Add some habits to see your progress here!</p>
          </div>
        )}
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default ViewStats;
