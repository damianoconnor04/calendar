'use client'
import React, { useState } from 'react'
import moment, { Moment } from 'moment'
import RenderCalendar from './components/RenderCalendar'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

const Calendar: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState<Moment>(moment())
  const currentHours = moment()
  const handlePreviousWeek = () => { setCurrentWeek(currentWeek.clone().subtract(1, 'week')) }
  const handleNextWeek = () => { setCurrentWeek(currentWeek.clone().add(1, 'week')) }

  return (
    <>
      <header className="p-5 flex items-center border-b border-gray-400">
        <button className='p-1.5 text-2xl text-neutral-700 rounded-full hover:bg-neutral-300/20 transition-colors' onClick={handlePreviousWeek}><IoChevronBack /></button>
        <button className='p-1.5 text-2xl text-neutral-700 rounded-full hover:bg-neutral-300/20 transition-colors' onClick={handleNextWeek}><IoChevronForward /></button>
        <h1 className="ml-6 text-2xl text-neutral-700">{currentWeek.format('MMMM YYYY')}</h1>
      </header>

      <RenderCalendar currentWeek={currentWeek} currentHours={currentHours} />
    </>
  )
}

export default Calendar