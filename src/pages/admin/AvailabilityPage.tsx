import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, Loader, AlertTriangle, Edit, Trash2, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format, parseISO, isWithinInterval, addDays } from 'date-fns';

interface Cabin {
  id: string;
  name: string;
}

interface TimeSlot {
  id: string;
  cabin_id: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

interface Holiday {
  id: string;
  name: string;
  date: string;
  is_recurring: boolean;
}

interface Reservation {
  id: string;
  cabin_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const AvailabilityPage: React.FC = () => {
  const [cabins, setCabins] = useState<Cabin[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedCabin, setSelectedCabin] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showHolidayModal, setShowHolidayModal] = useState(false);

  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch cabins
        const { data: cabinsData, error: cabinsError } = await supabase
          .from('cabins')
          .select('id, name')
          .order('name');

        if (cabinsError) throw cabinsError;
        setCabins(cabinsData || []);

        // Set first cabin as selected if none selected
        if (!selectedCabin && cabinsData?.length > 0) {
          setSelectedCabin(cabinsData[0].id);
        }

        // Fetch time slots
        const { data: timeSlotsData, error: timeSlotsError } = await supabase
          .from('cabin_time_slots')
          .select('*')
          .order('start_time');

        if (timeSlotsError) throw timeSlotsError;
        setTimeSlots(timeSlotsData || []);

        // Fetch holidays
        const { data: holidaysData, error: holidaysError } = await supabase
          .from('holidays')
          .select('*')
          .order('date');

        if (holidaysError) throw holidaysError;
        setHolidays(holidaysData || []);

        // Fetch reservations
        const { data: reservationsData, error: reservationsError } = await supabase
          .from('cabin_reservations')
          .select('*')
          .order('start_date');

        if (reservationsError) throw reservationsError;
        setReservations(reservationsData || []);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCabin]);

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    
    // Add days from previous month to start on Sunday
    const firstDay = startDate.getDay();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: addDays(startDate, -i - 1),
        isCurrentMonth: false
      });
    }

    // Add days of current month
    for (let i = 1; i <= endDate.getDate(); i++) {
      days.push({
        date: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i),
        isCurrentMonth: true
      });
    }

    // Add days from next month to end on Saturday
    const lastDay = endDate.getDay();
    for (let i = 1; i < 7 - lastDay; i++) {
      days.push({
        date: addDays(endDate, i),
        isCurrentMonth: false
      });
    }

    return days;
  };

  // Check if a date is a holiday
  const isHoliday = (date: Date) => {
    return holidays.some(holiday => {
      const holidayDate = parseISO(holiday.date);
      return (
        holiday.is_recurring
          ? holidayDate.getMonth() === date.getMonth() && holidayDate.getDate() === date.getDate()
          : holidayDate.getTime() === date.getTime()
      );
    });
  };

  // Check if a date has reservations
  const getReservationsForDate = (date: Date) => {
    if (!selectedCabin) return [];
    
    return reservations.filter(reservation => {
      const startDate = parseISO(reservation.start_date);
      const endDate = parseISO(reservation.end_date);
      return (
        reservation.cabin_id === selectedCabin &&
        isWithinInterval(date, { start: startDate, end: endDate })
      );
    });
  };

  // Get time slots for selected cabin
  const getCabinTimeSlots = () => {
    if (!selectedCabin) return [];
    return timeSlots.filter(slot => slot.cabin_id === selectedCabin && slot.is_active);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Error loading calendar</h3>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Cabin Availability</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowHolidayModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
          >
            <CalendarIcon className="h-5 w-5 mr-2" />
            Manage Holidays
          </button>
          <button
            onClick={() => setShowReservationModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Reservation
          </button>
        </div>
      </div>

      {/* Cabin Selector */}
      <div className="mb-6">
        <label htmlFor="cabin" className="block text-sm font-medium text-gray-700">
          Select Cabin
        </label>
        <select
          id="cabin"
          value={selectedCabin || ''}
          onChange={(e) => setSelectedCabin(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        >
          {cabins.map((cabin) => (
            <option key={cabin.id} value={cabin.id}>
              {cabin.name}
            </option>
          ))}
        </select>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          &larr;
        </button>
        <h3 className="text-lg font-medium text-gray-900">
          {format(selectedDate, 'MMMM yyyy')}
        </h3>
        <button
          onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          &rarr;
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 text-sm font-medium text-gray-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="px-4 py-2 text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {generateCalendarDays().map(({ date, isCurrentMonth }, index) => {
            const dateReservations = getReservationsForDate(date);
            const isHolidayDate = isHoliday(date);
            const timeSlots = getCabinTimeSlots();

            return (
              <div
                key={index}
                className={`min-h-32 bg-white p-2 ${
                  isCurrentMonth ? '' : 'bg-gray-50 text-gray-400'
                }`}
              >
                <div className="flex justify-between">
                  <span className="text-sm">{format(date, 'd')}</span>
                  {isHolidayDate && (
                    <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-800 rounded-full">
                      Holiday
                    </span>
                  )}
                </div>

                {/* Time Slots */}
                <div className="mt-2 space-y-1">
                  {timeSlots.map((slot) => {
                    const hasReservation = dateReservations.some(
                      res => res.start_time === slot.start_time && res.end_time === slot.end_time
                    );

                    return (
                      <div
                        key={slot.id}
                        className={`text-xs p-1 rounded ${
                          hasReservation
                            ? 'bg-green-100 text-green-800'
                            : isHolidayDate
                            ? 'bg-red-50 text-red-700'
                            : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(parseISO(`2000-01-01T${slot.start_time}`), 'h:mm a')} -
                          {format(parseISO(`2000-01-01T${slot.end_time}`), 'h:mm a')}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reservations */}
                {dateReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className={`mt-1 text-xs p-1 rounded ${
                      reservation.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : reservation.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{reservation.status}</span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => {/* Handle edit */}}
                          className="p-1 hover:bg-white/50 rounded"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => {/* Handle delete */}}
                          className="p-1 hover:bg-white/50 rounded"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Confirmed</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-100 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Pending</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-100 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Holiday</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-50 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Available</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPage;