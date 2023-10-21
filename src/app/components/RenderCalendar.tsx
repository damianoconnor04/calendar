import React, { useEffect, useState } from 'react'
import { IoAddCircle } from 'react-icons/io5'
import EventModal from './EventModal'
import { startOfWeek, endOfWeek, addDays, format, parseISO } from 'date-fns'

interface RenderCalendarProps { currentWeek: Date, currentHours: Date }
const RenderCalendar: React.FC<RenderCalendarProps> = ({ currentWeek, currentHours }) => {
  useEffect(() => {
    const savedEventNames: { [key: string]: string } = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) savedEventNames[key] = localStorage.getItem(key) ?? '' //when null return string so typescript not angry
    }
    setEventNames(savedEventNames)
  }, [])
  const [clickedId, setClickedId] = useState<string | null>(null)
  const [eventModal, setEventModal] = useState<boolean>(false)
  const [eventNames, setEventNames] = useState<{ [key: string]: string }>({})

  const createNewEvent = (hour: string, date: string) => {
    const id = `${hour}-${date}`
    setClickedId(id)
    if (!eventNames[id]) setEventNames(prevNames => ({ ...prevNames, [id]: 'New event' }))
    setEventModal(true)
  }

  const removeEvent = (id: string) => {
    setEventNames(prevNames => {
      const newEventNames = { ...prevNames }
      delete newEventNames[id]
      return newEventNames
    })
  }

  const generateDates = () => {
    const startDate = startOfWeek(currentWeek)
    const endDate = endOfWeek(currentWeek)
    const dates = []
    for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
      dates.push(date)
    }
    return dates
  }

  const generateHours = () => {
    const firstHour = new Date(currentHours)
    firstHour.setHours(0, 0, 0, 0)
    const lastHour = new Date(firstHour)
    lastHour.setHours(23, 59, 59, 999)
    const hours = []
    while (firstHour <= lastHour) {
      hours.push(new Date(firstHour))
      firstHour.setHours(firstHour.getHours() + 1)
    }
    return hours
  }

  const mapDatesToDaysOfWeek = (dates: Date[]): { date: Date; dayOfWeek: string }[] =>
    dates.map((date) => ({ date, dayOfWeek: date.toLocaleDateString(undefined, { weekday: 'short' }) }))

  const mapHoursToDaysOfWeek = (hours: Date[]): { hours: Date; hour: string }[] =>
    hours.map((hours) => ({ hours, hour: hours.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' }) }))

  const renderCalendar = () => {
    const dates = generateDates()
    const hours = generateHours()
    const mappedDates = mapDatesToDaysOfWeek(dates)
    const mappedHours = mapHoursToDaysOfWeek(hours)

    return (
      <div className='h-full max-h-[calc(100%_-_4.825rem)] overflow-hidden'> {/* max h is 100% minus header height & mappedDates container height */}

        <div className='grid grid-cols-[1fr,15fr,1fr]'>
          <button className='w-full p-4 grid place-items-center group'>
            <IoAddCircle className='text-4xl text-sky-400 group-hover:scale-125 transition-transform' />
          </button>
          <ul className='w-full grid grid-cols-7 gap-4 p-4 grid-rows-1'>
            {mappedDates.map(({ date, dayOfWeek }) => (
              <li key={date.toISOString()} className='flex flex-col items-center gap-3'>
                <span className='uppercase text-xs text-neutral-500'>{dayOfWeek}</span>
                <span className='text-2xl font-medium text-neutral-500'>{date.getDate()}</span>
              </li>
            ))}
          </ul>
        </div>

        <main className='h-[calc(100%_-_5.75rem)] grid grid-rows-24 grid-cols-[1fr,15fr,1fr] overflow-y-scroll hide-scroll'>
          <div className='w-full grid grid-cols-1 grid-rows-24 p-2 whitespace-nowrap'>
            {mappedHours.map(({ hour }) => (
              <li key={hour} className='flex flex-col items-end gap-3 p-2'>
                <span className='uppercase text-xs text-neutral-500'>{hour}</span>
              </li>
            ))}
          </div>
          <section id='dates-container' className='w-full grid grid-cols-7 grid-rows-24 p-2 overflow-hidden'>
            {mappedDates.map(({ date, dayOfWeek }) => (
              <div key={dayOfWeek} className='grid grid-cols-1 grid-rows-24 border-r border-gray-300 last:border-none'>
                {mappedHours.map(({ hour }) => (
                  <div id={`${hour}-${format(date, 'EEEE-MMMM-dd')}`} key={`${hour}-${date}`} className='relative border-b border-gray-300 last:border-none'>
                    <button onClick={() => createNewEvent(hour, format(date, 'EEEE-MMMM-dd'))} className='w-full h-full hover:ring-[1px] hover:ring-sky-400'>
                      {localStorage.getItem(`${hour}-${format(date, 'EEEE-MMMM-dd')}`) && <p className='w-full h-full truncate grid place-items-center bg-sky-400 text-white font-medium text-sm'>{eventNames[`${hour}-${format(date, 'EEEE-MMMM-dd')}`]}</p>}
                    </button>
                  </div>
                ))}
              </div>
            ))}
            {eventModal && <EventModal clickedId={clickedId} eventNames={eventNames} setEventNames={setEventNames} setEventModal={setEventModal} removeEvent={removeEvent} />}
          </section>
        </main>

      </div>
    )
  }
  return renderCalendar()
}

export default RenderCalendar