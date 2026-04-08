"use client";
import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, isWithinInterval } from 'date-fns';
import { ChevronLeft, ChevronRight, Edit3, Sparkles, MapPin, Clock } from 'lucide-react';

export default function InteractiveCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [note, setNote] = useState("");
  const [bgImage, setBgImage] = useState(`https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200&sig=${new Date().getDate()}`);

  const onDateClick = (day: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else if (day < startDate) {
      setStartDate(day);
    } else if (isSameDay(day, startDate)) {
      setStartDate(null);
    } else {
      setEndDate(day);
    }
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center px-8 py-10 bg-white border-b border-gray-50">
      <div className="flex flex-col">
        <span className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
          {format(currentMonth, "MMMM")}
        </span>
        <div className="flex items-center gap-2 mt-2">
          <div className="h-1.5 w-10 bg-gradient-to-r from-blue-600 to-indigo-400 rounded-full" />
          <span className="text-slate-400 font-bold tracking-[0.4em] text-[10px]">{format(currentMonth, "yyyy")}</span>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="group p-3.5 bg-blue-50/50 hover:bg-blue-600 rounded-2xl transition-all duration-500 border border-blue-100/50 shadow-sm"
        >
          <ChevronLeft size={22} className="text-blue-600 group-hover:text-white transition-colors" />
        </button>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="group p-3.5 bg-blue-50/50 hover:bg-blue-600 rounded-2xl transition-all duration-500 border border-blue-100/50 shadow-sm"
        >
          <ChevronRight size={22} className="text-blue-600 group-hover:text-white transition-colors" />
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
        const isToday = isSameDay(day, new Date());

        days.push(
          <div
            key={day.toString()}
            className={`relative h-16 flex items-center justify-center cursor-pointer transition-all duration-300 group
              ${!isCurrentMonth ? "text-slate-200" : "text-slate-600 font-semibold"}
              ${isInRange && !isSelected ? "bg-blue-50/40" : ""}
            `}
            onClick={() => onDateClick(cloneDay)}
          >
            {isSelected && (
              <div className="absolute inset-0 flex items-center justify-center z-0">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-xl shadow-blue-200 ring-4 ring-white animate-in zoom-in duration-300" />
              </div>
            )}

            {isToday && !isSelected && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-8 border-b-2 border-blue-500 mt-7 opacity-60 animate-pulse" />
              </div>
            )}

            <span className={`relative z-10 text-sm ${isSelected ? "text-white font-bold" : isToday ? "text-blue-600 font-black" : "group-hover:text-blue-500 group-hover:scale-125 transition-transform"}`}>
              {format(day, "d")}
            </span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(<div className="grid grid-cols-7 border-b border-slate-50 last:border-0" key={day.toString()}>{days}</div>);
      days = [];
    }
    return <div className="bg-white">{rows}</div>;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-10 font-sans">
      <div className="w-full max-w-6xl bg-white rounded-[3.5rem] shadow-[0_50px_120px_-30px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col md:flex-row border-[12px] border-white">

        <div className="md:w-[42%] relative flex flex-col bg-slate-900 min-h-[450px]">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={bgImage}
              key={bgImage}
              className="w-full h-full object-cover opacity-80 transition-transform duration-[4000ms] hover:scale-105"
              alt="Background"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent" />
          </div>

          <div className="relative z-10 p-12 flex flex-col h-full justify-between">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/20 w-fit">
              <Sparkles size={16} className="text-yellow-400 animate-spin-slow" />
              <span className="text-[10px] font-black tracking-[0.25em] text-white uppercase">Daily Vibe</span>
            </div>

            <div className="mt-auto">
              <div className="flex items-center gap-2 text-blue-400 mb-3">
                <MapPin size={16} />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Global Inspiration</span>
              </div>
              <h2 className="text-7xl font-black text-white leading-[0.8] tracking-tighter mb-6">
                STAY<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  INSPIRED.
                </span>
              </h2>
              <div className="p-5 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
                <p className="text-white/70 text-sm font-medium leading-relaxed italic">
                  "The secret of your future is hidden in your daily routine."
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-[58%] flex flex-col bg-white">
          {renderHeader()}

          <div className="p-8 md:p-12 flex-grow">
            <div className="grid grid-cols-7 mb-8">
              {['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'].map(d => (
                <div key={d} className="text-center text-[10px] font-black text-slate-300 tracking-[0.3em]">{d}</div>
              ))}
            </div>

            <div className="rounded-[3rem] overflow-hidden border border-slate-50 shadow-2xl shadow-slate-200/40 mb-12">
              {renderCells()}
            </div>

            <div className="relative group">
              <div className="flex items-center justify-between mb-5 px-2">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                    <Edit3 size={22} />
                  </div>
                  <div>
                    <h3 className="font-black text-xs uppercase tracking-widest text-slate-800 leading-none">Journal</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-tighter">Capture your thoughts</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 py-2 px-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <Clock size={14} className="text-blue-500" />
                  <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">
                    {format(new Date(), "eeee, do MMM")}
                  </span>
                </div>
              </div>

              <textarea
                placeholder="Write your plans for the month..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-slate-50/50 border-2 border-slate-100 focus:border-blue-200 focus:bg-white p-7 rounded-[2.5rem] text-sm text-slate-600 outline-none transition-all h-36 resize-none shadow-inner leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}