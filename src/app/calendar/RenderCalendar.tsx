import React from 'react'
import moment, { Moment } from 'moment'

interface RenderCalendarProps { currentMonth: Moment }
const RenderCalendar: React.FC<RenderCalendarProps> = ({ currentMonth }) => {
  const generateDates = () => {
    const startDate = currentMonth.clone().startOf('month')
    const endDate = currentMonth.clone().endOf('month')
    const dates = []
    while (startDate.isSameOrBefore(endDate)) { dates.push(startDate.clone()); startDate.add(1, 'day') }
    return dates
  }

  const mapDatesToDaysOfWeek = (dates: Moment[]): { date: Moment; dayOfWeek: string }[] =>
    dates.map((date) => ({ date, dayOfWeek: date.format('dddd') }))

  const renderCalendar = () => {
    const dates = generateDates()
    const mappedDates = mapDatesToDaysOfWeek(dates)
    const eventCount = 5
    return (
      <div className='p-2'>
        <ul className="grid grid-cols-7 gap-4 grid-rows-5">
          {mappedDates.map(({ date, dayOfWeek }) => (
            <li key={date.format('YYYY-MM-DD')} className='border p-2 text-[10px] rounded-lg bg-slate-200 hover:scale-110 transition-transform duration-300'>
              <div className='flex items-center justify-between cursor-pointer'>
                <span>{dayOfWeek}</span>
                <span className="font-bold">{date.format('DD')}</span>
              </div>
              <button className='rounded-xl text-center bg-sky-200 w-full'>{eventCount} events</button>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return renderCalendar()
}

export default RenderCalendar