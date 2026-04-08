"use client";
import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isWithinInterval } from 'date-fns';
import { ChevronLeft, ChevronRight, Edit3, Calendar as CalendarIcon, Sparkles } from 'lucide-react';

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
    <div className="flex justify-between items-center px-6 py-8 bg-white border-b border-gray-100">
      <div className="flex flex-col">
        <span className="text-4xl font-black text-blue-600 tracking-tighter uppercase leading-none">
          {format(currentMonth, "MMMM")}
        </span>
        <span className="text-gray-400 font-bold tracking-[0.3em] text-xs mt-1">{format(currentMonth, "yyyy")}</span>
      </div>
      <div className="flex gap-3">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2.5 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-300 text-blue-600 border border-blue-100 shadow-sm">
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2.5 hover:bg-blue-600 hover:text-white rounded-xl transition-all duration-300 text-blue-600 border border-blue-100 shadow-sm">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );

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
              ${!isCurrentMonth ? "text-gray-200" : "text-gray-700 font-medium"}
              ${isInRange && !isSelected ? "bg-blue-50/80" : ""}
            `}
            onClick={() => onDateClick(cloneDay)}
          >
            {isSelected && (
              <div className="absolute inset-0 flex items-center justify-center z-0">
                <div className="h-11 w-11 bg-blue-600 rounded-xl rotate-12 shadow-lg shadow-blue-200 group-hover:rotate-0 transition-transform duration-300" />
              </div>
            )}

            <span className={`relative z-10 text-sm ${isSelected ? "text-white font-bold" : "group-hover:text-blue-600"}`}>
              {format(day, "d")}
            </span>

            {isSameDay(day, new Date()) && !isSelected && (
              <div className="absolute top-2 right-2 h-1.5 w-1.5 bg-orange-400 rounded-full animate-pulse" />
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-6xl bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col md:flex-row border-8 border-white">

        {/* Left Section: Aesthetic Hero & Quick Notes */}
        <div className="md:w-[40%] relative bg-slate-900 flex flex-col">
          <div className="h-2/3 relative overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80"
              alt="Workspace"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

            {/* Design Element from PDF: Overlay Label */}
            <div className="absolute bottom-8 left-8">
              <div className="flex items-center gap-2 mb-3 bg-blue-500/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 w-fit">
                <Sparkles size={14} className="text-blue-200" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase">2026 Edition</span>
              </div>
              <h2 className="text-5xl font-black text-white leading-none tracking-tighter">PLAN<br />AHEAD.</h2>
            </div>
          </div>

          {/* Lines for Notes like physical calendar */}
          <div className="h-1/3 p-8 bg-slate-900 flex flex-col justify-center">
            <h3 className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Quick Reminders</h3>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="border-b border-slate-700 w-full h-4 opacity-50" />
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Calendar Engine */}
        <div className="md:w-[60%] flex flex-col">
          {renderHeader()}

          <div className="p-6 md:p-10 flex-grow">
            <div className="grid grid-cols-7 mb-4">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
                <div key={d} className="text-center text-[11px] font-black text-slate-400 tracking-widest">{d}</div>
              ))}
            </div>

            <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50">
              {renderCells()}
            </div>

            {/* Main Interactive Notes */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                  <Edit3 size={18} className="text-blue-500" />
                  <h3 className="font-bold text-sm text-slate-700">Detailed Notes</h3>
                </div>
                {startDate && (
                  <div className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100">
                    {format(startDate, "dd MMM")} {endDate ? `→ ${format(endDate, "dd MMM")}` : ""}
                  </div>
                )}
              </div>
              <textarea
                placeholder="What's happening this month?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 focus:border-blue-200 focus:bg-white p-5 rounded-[2rem] text-sm text-slate-600 outline-none transition-all h-32 resize-none shadow-inner"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}