
import React, { useState, useEffect } from 'react';
import { collection, query, where, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import TopNavbar from '@/components/TopNavbar';
import BottomNavbar from '@/components/BottomNavbar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Edit, Save, X } from 'lucide-react';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
}

const Journals = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [currentEntry, setCurrentEntry] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [journals, setJournals] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchJournals();
  }, [user]);

  useEffect(() => {
    setCurrentEntry(journals[selectedDate] || '');
    setIsEditing(false);
  }, [selectedDate, journals]);

  const fetchJournals = async () => {
    if (!user) return;
    
    try {
      const journalsRef = collection(db, 'journals');
      const q = query(journalsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const journalEntries: Record<string, string> = {};
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        journalEntries[data.date] = data.content;
      });
      
      setJournals(journalEntries);
    } catch (error) {
      console.error('Error fetching journals:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveJournal = async () => {
    if (!user) return;
    
    try {
      const journalId = `${user.uid}_${selectedDate}`;
      const journalRef = doc(db, 'journals', journalId);
      
      await setDoc(journalRef, {
        userId: user.uid,
        date: selectedDate,
        content: currentEntry,
        updatedAt: new Date().toISOString()
      });
      
      setJournals(prev => ({
        ...prev,
        [selectedDate]: currentEntry
      }));
      
      setIsEditing(false);
      toast({ title: "Journal saved successfully! ✍️" });
    } catch (error) {
      console.error('Error saving journal:', error);
      toast({ title: "Error saving journal", variant: "destructive" });
    }
  };

  const renderCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();
    
    const days = [];
    
    // Padding for empty cells
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = format(new Date(year, month, day), 'yyyy-MM-dd');
      const hasEntry = journals[dateStr];
      const isSelected = dateStr === selectedDate;
      const isToday = dateStr === format(today, 'yyyy-MM-dd');
      
      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(dateStr)}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
            ${isSelected 
              ? 'bg-blue-500 text-white' 
              : hasEntry 
                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                : 'hover:bg-gray-100'
            }
            ${isToday ? 'ring-2 ring-blue-300' : ''}
          `}
        >
          {day}
        </button>
      );
    }
    
    return (
      <div className="grid grid-cols-7 gap-1 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-xs font-semibold text-gray-500 p-2">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your journals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <TopNavbar title="Daily Journal" />
      
      <div className="p-4 space-y-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-4 text-center">
              {format(new Date(), 'MMMM yyyy')}
            </h3>
            {renderCalendar()}
            <div className="mt-4 flex justify-center space-x-4 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-100 rounded-full mr-1"></div>
                <span className="text-gray-600">Has entry</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                <span className="text-gray-600">Selected</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">
                {format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}
              </h3>
              <div className="flex space-x-2">
                {!isEditing ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={saveJournal}
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCurrentEntry(journals[selectedDate] || '');
                        setIsEditing(false);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {isEditing ? (
              <Textarea
                value={currentEntry}
                onChange={(e) => setCurrentEntry(e.target.value)}
                placeholder="What's on your mind today? Write about your thoughts, feelings, or experiences..."
                className="min-h-[200px] resize-none"
                autoFocus
              />
            ) : (
              <div className="min-h-[200px] p-3 bg-gray-50 rounded-lg">
                {currentEntry ? (
                  <p className="text-gray-800 whitespace-pre-wrap">{currentEntry}</p>
                ) : (
                  <p className="text-gray-500 italic">
                    No entry for this date. Click the edit button to add one.
                  </p>
                )}
              </div>
            )}
            
            {isEditing && (
              <div className="mt-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentEntry(journals[selectedDate] || '');
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={saveJournal}>
                  Save Entry
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <BottomNavbar />
    </div>
  );
};

export default Journals;
