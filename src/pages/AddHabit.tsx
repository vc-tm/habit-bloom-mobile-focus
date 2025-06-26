
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '@/components/TopNavbar';
import BottomNavbar from '@/components/BottomNavbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';

const AddHabit = () => {
  const [habitName, setHabitName] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekdays' | 'specific'>('daily');
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([]);
  const [specificDate, setSpecificDate] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const weekdays = [
    { id: 0, name: 'Sunday', short: 'Sun' },
    { id: 1, name: 'Monday', short: 'Mon' },
    { id: 2, name: 'Tuesday', short: 'Tue' },
    { id: 3, name: 'Wednesday', short: 'Wed' },
    { id: 4, name: 'Thursday', short: 'Thu' },
    { id: 5, name: 'Friday', short: 'Fri' },
    { id: 6, name: 'Saturday', short: 'Sat' },
  ];

  const handleWeekdayToggle = (dayId: number) => {
    setSelectedWeekdays(prev => 
      prev.includes(dayId) 
        ? prev.filter(id => id !== dayId)
        : [...prev, dayId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!habitName.trim()) {
      toast({ title: "Please enter a habit name", variant: "destructive" });
      return;
    }
    
    if (frequency === 'weekdays' && selectedWeekdays.length === 0) {
      toast({ title: "Please select at least one weekday", variant: "destructive" });
      return;
    }
    
    if (frequency === 'specific' && !specificDate) {
      toast({ title: "Please select a specific date", variant: "destructive" });
      return;
    }

    setLoading(true);
    
    try {
      const habitData = {
        name: habitName.trim(),
        frequency,
        userId: user?.uid,
        completedDates: [],
        createdAt: new Date().toISOString(),
        ...(frequency === 'weekdays' && { weekdays: selectedWeekdays }),
        ...(frequency === 'specific' && { specificDate })
      };

      await addDoc(collection(db, 'habits'), habitData);
      
      toast({ title: "Habit created successfully! 🎉" });
      navigate('/home');
    } catch (error) {
      console.error('Error creating habit:', error);
      toast({ title: "Error creating habit", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopNavbar title="Add New Habit" />
      
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">Create a New Habit</CardTitle>
            <p className="text-gray-600">Build consistency one habit at a time</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="habitName" className="text-base font-semibold">
                  Habit Name
                </Label>
                <Input
                  id="habitName"
                  type="text"
                  placeholder="e.g., Drink 8 glasses of water"
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  className="mt-2 h-12"
                />
              </div>

              <div>
                <Label className="text-base font-semibold mb-4 block">
                  How often?
                </Label>
                <RadioGroup value={frequency} onValueChange={(value: any) => setFrequency(value)}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily" className="flex-1">
                      <div className="font-medium">Every day</div>
                      <div className="text-sm text-gray-600">Build a daily routine</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="weekdays" id="weekdays" />
                    <Label htmlFor="weekdays" className="flex-1">
                      <div className="font-medium">Specific weekdays</div>
                      <div className="text-sm text-gray-600">Choose which days of the week</div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="specific" id="specific" />
                    <Label htmlFor="specific" className="flex-1">
                      <div className="font-medium">Specific date</div>
                      <div className="text-sm text-gray-600">One-time or special occasion</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {frequency === 'weekdays' && (
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Select Days
                  </Label>
                  <div className="grid grid-cols-7 gap-2">
                    {weekdays.map((day) => (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => handleWeekdayToggle(day.id)}
                        className={`p-2 rounded-lg text-center transition-colors ${
                          selectedWeekdays.includes(day.id)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <div className="text-xs font-medium">{day.short}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {frequency === 'specific' && (
                <div>
                  <Label htmlFor="specificDate" className="text-base font-semibold">
                    Select Date
                  </Label>
                  <Input
                    id="specificDate"
                    type="date"
                    value={specificDate}
                    onChange={(e) => setSpecificDate(e.target.value)}
                    className="mt-2 h-12"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-500 hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Habit'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default AddHabit;
