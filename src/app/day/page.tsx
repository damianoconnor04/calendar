'use client'
import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { IoCaretDown, IoChevronBack, IoChevronForward } from 'react-icons/io5'
import Dropdown, { Option } from 'react-dropdown'
import 'react-dropdown/style.css'
import { format, getDate, getYear, parseISO } from 'date-fns'

const Day = () => {
  const searchParams = useSearchParams()
  const dateParams = searchParams.get('date')?.toString()
  if (dateParams) {
    const [currentDay, setCurrentDay] = useState<Date>(new Date(format(parseISO(dateParams), 'MMMM dd yyyy')))
    
    const handlePreviousDay = () => {
      const newDate = new Date(currentDay)
      newDate.setDate(newDate.getDate() - 1)
      setCurrentDay(newDate)
    }
    const handleNextDay = () => {
      const newDate = new Date(currentDay)
      newDate.setDate(newDate.getDate() + 1)
      setCurrentDay(newDate)
    }

    const monthOptions = Array.from({ length: 12 }, (_, i) => {
      const date = new Date()
      date.setMonth(i)
      return format(date, 'MMMM')
    })
    const dayOptions = Array.from({ length: 31 }, (_, i) => {
      const date = new Date()
      date.setDate(i)
      return format(date, 'dd')
    })
    const handleMonthChange = (e: Option) => (setCurrentDay(new Date(currentDay + e.value + getYear(currentDay))))
    const handleDayChange = (e: Option) => (setCurrentDay(new Date(currentDay + e.value + getYear(currentDay))))
    return (
      <>
        <header className='p-4 max-h-[10vh] h-full flex items-center gap-6 border-b border-gray-400'>
          <div>
            <button className='p-1.5 text-2xl text-neutral-700 rounded-full hover:bg-neutral-300/20 transition-colors' onClick={handlePreviousDay}><IoChevronBack /></button>
            <button className='p-1.5 text-2xl text-neutral-700 rounded-full hover:bg-neutral-300/20 transition-colors' onClick={handleNextDay}><IoChevronForward /></button>
          </div>

          <div className='flex gap-2'>
            <Dropdown
              arrowClosed={<IoCaretDown className='text-sm' />}
              arrowOpen={<IoCaretDown className='text-sm' />}
              controlClassName='!cursor-pointer !p-0 !py-1 !shadow-none !border-transparent !border-b-gray-300 hover:!border-b-sky-400 transition-colors !text-neutral-600 text-xl font-medium flex items-center gap-3'
              menuClassName='!border-none !bg-white !max-h-[60vh] !w-max !overflow-x-hidden'
              options={monthOptions}
              value={format(currentDay, 'MMMM')}
              onChange={(e) => handleMonthChange(e)}
            />
            <Dropdown
              arrowClosed={<IoCaretDown className='text-sm' />}
              arrowOpen={<IoCaretDown className='text-sm' />}
              controlClassName='!cursor-pointer !p-0 !py-1 !shadow-none !border-transparent !border-b-gray-300 hover:!border-b-sky-400 transition-colors !text-neutral-600 text-xl font-medium flex items-center gap-3'
              menuClassName='!border-none !bg-white !max-h-[60vh] !w-max !overflow-x-hidden'
              options={dayOptions}
              value={format(currentDay, 'dd')}
              onChange={(e) => handleDayChange(e)}
            />
          </div>

          <button className='text-sky-400 ml-auto font-bold underline underline-offset-2' onClick={() => setCurrentDay(new Date())}>Today</button>
        </header>

        
      </>
    )
  }
  return null
}

export default Day