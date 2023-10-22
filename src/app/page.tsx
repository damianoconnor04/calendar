'use client'
import React, { useState } from 'react'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'
import { format, isThisMonth } from 'date-fns'
import RenderCalendar from './components/RenderCalendar'

const Calendar: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date())
  const currentHours = new Date()
  const handlePreviousWeek = () => {
    const newDate = new Date(currentWeek)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentWeek(newDate)
  }
  const handleNextWeek = () => {
    const newDate = new Date(currentWeek)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentWeek(newDate)
  }

  return (
    <>
      <header className='p-5 flex items-center border-b border-gray-400'>
        <button className='p-1.5 text-2xl text-neutral-700 rounded-full hover:bg-neutral-300/20 transition-colors' onClick={handlePreviousWeek}><IoChevronBack /></button>
        <button className='p-1.5 text-2xl text-neutral-700 rounded-full hover:bg-neutral-300/20 transition-colors' onClick={handleNextWeek}><IoChevronForward /></button>
        <h1 className={`ml-6 text-2xl text-neutral-700 ${isThisMonth(currentWeek) && '!text-sky-400'}`}>{format(currentWeek, 'MMMM yyyy')}</h1>
      </header>

      <RenderCalendar currentWeek={currentWeek} currentHours={currentHours} />
    </>
  )
}

export default Calendar