'use client'
import React, { useState } from 'react'
import { IoCaretDown, IoCaretForward, IoChevronBack, IoChevronForward } from 'react-icons/io5'
import { addMonths, format, startOfMonth, startOfWeek } from 'date-fns'
import RenderCalendar from './components/RenderCalendar'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

const Calendar: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date())
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

  const options = [
    format(new Date(), 'MMMM yyyy'),
    format(addMonths(new Date(), 1), 'MMMM yyyy'),
    format(addMonths(new Date(), 2), 'MMMM yyyy')
  ]
  
  return (
    <>
      <header className='p-4 flex items-center gap-6 border-b border-gray-400'>
        <div>
          <button className='p-1.5 text-2xl text-neutral-700 rounded-full hover:bg-neutral-300/20 transition-colors' onClick={handlePreviousWeek}><IoChevronBack /></button>
          <button className='p-1.5 text-2xl text-neutral-700 rounded-full hover:bg-neutral-300/20 transition-colors' onClick={handleNextWeek}><IoChevronForward /></button>
        </div>

        <Dropdown 
          arrowClosed={<IoCaretDown />}
          arrowOpen={<IoCaretDown />} 
          controlClassName='!border-none !bg-transparent !text-neutral-600 text-xl font-medium flex items-center gap-2' 
          className='w-full max-w-xs' 
          menuClassName='!bg-white/20 !border-none backdrop-blur-sm'
          options={options} 
          value={format(currentWeek, 'MMMM yyyy')} 
          onChange={(e) => setCurrentWeek(startOfMonth(new Date(e.value))) }
        />

        <button className='text-sky-400 ml-auto font-bold underline underline-offset-2' onClick={() => setCurrentWeek(startOfWeek(new Date()))}>
          Today
        </button>
      </header>

      <RenderCalendar currentWeek={currentWeek} />
    </>
  )
}

export default Calendar