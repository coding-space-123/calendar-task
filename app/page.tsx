"use client";
import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isWithinInterval } from 'date-fns';
import { ChevronLeft, ChevronRight, Edit3, Calendar as CalendarIcon } from 'lucide-react';

export default function InteractiveCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [note, setNote] = useState("");

  const onDateClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else if (day < startDate) {
      setStartDate(day);
    } else {
      setEndDate(day);
    }
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center px-4 py-6 bg-white border-b">
      <div className="flex flex-col">
        <span className="text-3xl font-black text-blue-600 tracking-tighter uppercase">
          {format(currentMonth, "MMMM")}
        </span>
        <span className="text-gray-400 font-bold tracking-widest -mt-1">{format(currentMonth, "yyyy")}</span>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-blue-50 rounded-full transition-colors text-blue-600 border border-blue-100">
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-blue-50 rounded-full transition-colors text-blue-600 border border-blue-100">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map(d => (
          <div key={d} className="text-center text-[10px] font-black text-gray-400 py-2 tracking-widest">{d}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDateRange = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDateRange = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDateRange;

    while (day <= endDateRange) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isSelected = (startDate && isSameDay(day, startDate)) || (endDate && isSameDay(day, endDate));
        const isInRange = startDate && endDate && isWithinInterval(day, { start: startDate, end: endDate });
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            className={`relative h-14 flex items-center justify-center cursor-pointer transition-all duration-300 group
              ${!isCurrentMonth ? "text-gray-200" : "text-gray-700"}
              ${isInRange && !isSelected ? "bg-blue-50" : ""}
              ${isSelected ? "z-10" : ""}
            `}
            onClick={() => onDateClick(cloneDay)}
          >
            {/* Range Selection Background logic */}
            {isSelected && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 bg-blue-600 rounded-full shadow-lg shadow-blue-200 scale-110 transition-transform group-hover:scale-125" />
              </div>
            )}

            <span className={`relative font-semibold text-sm ${isSelected ? "text-white" : "group-hover:text-blue-600"}`}>
              {format(day, "d")}
            </span>

            {/* Today Marker */}
            {isSameDay(day, new Date()) && !isSelected && (
              <div className="absolute bottom-2 h-1 w-1 bg-blue-400 rounded-full" />
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="grid grid-cols-7 border-b border-gray-50 last:border-0" key={day.toString()}>{days}</div>);
      days = [];
    }
    return <div className="bg-white">{rows}</div>;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row border border-white">

        {/* Left Side: Visual Anchor (PDF style) */}
        <div className="md:w-[45%] relative min-h-[300px] md:min-h-full overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            alt="Nature"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-10 left-10 text-white">
            <div className="flex items-center gap-2 mb-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full w-fit">
              <CalendarIcon size={14} className="text-blue-300" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Adventure Awaits</span>
            </div>
            <h2 className="text-4xl font-black mb-1 leading-tight tracking-tight">Focus on <br /> the Goals.</h2>
            <p className="text-white/70 text-sm font-medium">Plan your journey step by step.</p>
          </div>
        </div>

        {/* Right Side: Logic & UI */}
        <div className="md:w-[55%] flex flex-col bg-white">
          {renderHeader()}

          <div className="p-4 md:p-8 flex-grow">
            {renderDays()}
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              {renderCells()}
            </div>

            {/* Notes Section - PDF UI Inspired */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Edit3 size={16} className="text-blue-600" />
                  </div>
                  <h3 className="font-black text-xs uppercase tracking-widest text-gray-500">Important Memos</h3>
                </div>
                {startDate && (
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-md">
                    Target: {format(startDate, "MMM d")} {endDate ? `- ${format(endDate, "MMM d")}` : ""}
                  </span>
                )}
              </div>
              <textarea
                placeholder="Write your monthly notes here..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-100 focus:bg-white p-4 rounded-2xl text-sm text-gray-600 outline-none transition-all h-28 resize-none shadow-inner"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}