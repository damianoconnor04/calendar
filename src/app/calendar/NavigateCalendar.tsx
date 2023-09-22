'use client'
import React, { useState } from 'react'
import moment, { Moment } from 'moment'
import RenderCalendar from './RenderCalendar'
import { IoChevronBack, IoChevronForward } from 'react-icons/io5'

const NavigateCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Moment>(moment())
  const handlePreviousMonth = () => { setCurrentMonth(currentMonth.clone().subtract(1, 'month')) }
  const handleNextMonth = () => { setCurrentMonth(currentMonth.clone().add(1, 'month')) }
  return (
    <div className='h-full grid place-items-center grid-rows-[auto,1fr]'>
      <div className="flex items-center gap-6 text-center">
        <button onClick={handlePreviousMonth}><IoChevronBack /></button>
        <h1 className="text-2xl font-bold">{currentMonth.format('MMMM YYYY')}</h1>
        <button onClick={handleNextMonth}><IoChevronForward /></button>
      </div>
      <RenderCalendar currentMonth={currentMonth} />
    </div>
  )
}

export default NavigateCalendar