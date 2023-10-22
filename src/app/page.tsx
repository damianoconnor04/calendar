'use client'
import React, { useState } from 'react'
import { IoCaretDown, IoChevronBack, IoChevronForward } from 'react-icons/io5'
import { format, getYear, setYear, startOfMonth, startOfWeek } from 'date-fns'
import RenderCalendar from './components/RenderCalendar'
import Dropdown, { Option } from 'react-dropdown'
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

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(i)
    return format(date, 'MMMM')
  })

  const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const date = new Date()
    date.setFullYear(date.getFullYear() + i)
    return format(date, 'yyyy')
  })

  const handleMonthChange = (e: Option) => setCurrentWeek(startOfMonth(new Date(e.value + getYear(currentWeek))))
  const handleYearChange = (e: Option) => setCurrentWeek(setYear(startOfMonth(new Date(currentWeek)), parseInt(e.value)))
  
  return (
    <>
      <header className='p-4 max-h-[10vh] h-full flex items-center gap-6 border-b border-gray-400'>
        <div>
          <button className='p-1.5 text-2xl text-neutral-700 rounded-full hover:bg-neutral-300/20 transition-colors' onClick={handlePreviousWeek}><IoChevronBack /></button>
          <button className='p-1.5 text-2xl text-neutral-700 rounded-full hover:bg-neutral-300/20 transition-colors' onClick={handleNextWeek}><IoChevronForward /></button>
        </div>

        <div className='flex gap-2'>
          <Dropdown
            arrowClosed={<IoCaretDown className='text-sm' />}
            arrowOpen={<IoCaretDown className='text-sm' />}
            controlClassName='!cursor-pointer !p-0 !py-1 !shadow-none !border-transparent !border-b-gray-300 hover:!border-b-sky-400 transition-colors !text-neutral-600 text-xl font-medium flex items-center gap-3'
            menuClassName='!border-none !bg-white !max-h-[60vh] !w-max !overflow-x-hidden'
            options={monthOptions}
            value={format(currentWeek, 'MMMM')}
            onChange={(e) => handleMonthChange(e)}
          />
          <Dropdown
            arrowClosed={<IoCaretDown className='text-sm' />}
            arrowOpen={<IoCaretDown className='text-sm' />}
            controlClassName='!cursor-pointer !p-0 !py-1 !shadow-none !border-transparent !border-b-gray-300 hover:!border-b-sky-400 transition-colors !text-neutral-600 text-xl font-medium flex items-center gap-3'
            menuClassName='!border-none !bg-white !max-h-[60vh] !w-max !overflow-x-hidden'
            options={yearOptions}
            value={format(currentWeek, 'yyyy')}
            onChange={(e) => handleYearChange(e)}
          />
        </div>

        <button className='text-sky-400 ml-auto font-bold underline underline-offset-2' onClick={() => setCurrentWeek(startOfWeek(new Date()))}>Today</button>
      </header>

      <RenderCalendar currentWeek={currentWeek} />
    </>
  )
}

export default Calendar