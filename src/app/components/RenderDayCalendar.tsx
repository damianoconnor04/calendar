import React, { useEffect, useState } from 'react'
import { IoAddCircle } from 'react-icons/io5'
import EventModal from './EventModal'
import { format, isToday, setHours, addHours, setMinutes } from 'date-fns'
import Link from 'next/link'

type Color = 'bg-sky-400' | 'bg-blue-500' | 'bg-purple-500' | 'bg-pink-500' | 'bg-red-500' | 'bg-orange-500' | 'bg-yellow-500' | 'bg-lime-500' | 'bg-green-500'

interface RenderDayCalendarProps { currentDay: Date }
const RenderDayCalendar: React.FC<RenderDayCalendarProps> = ({ currentDay }) => {
  useEffect(() => {
    const savedEventNames: { [key: string]: { name: string, color: Color} } = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) savedEventNames[key] = JSON.parse(localStorage.getItem(key) ?? '') //when null return string so typescript not angry
    }
    setEventNames(savedEventNames)
  }, [])
  const [clickedId, setClickedId] = useState<string | null>(null)
  const [eventModal, setEventModal] = useState<boolean>(false)
  const [eventNames, setEventNames] = useState<{ [key: string]: { name: string, color: Color } }>({})

  const createNewEvent = (hour: string, date: string) => {
    const id = `${hour}-${date}`
    setClickedId(id)
    if (!eventNames[id]) setEventNames(prevNames => ({ ...prevNames, [id]: { name: 'New event', color: 'bg-sky-400' } }))
    setEventModal(true)
  }

  const removeEvent = (id: string) => {
    setEventNames(prevNames => {
      const newEventNames = { ...prevNames }
      delete newEventNames[id]
      return newEventNames
    })
  }

  const generateHours = () => {
    const hours = []
    let currentHour = setHours(new Date(setMinutes(new Date(), 0)), 0)
    for (let i = 0; i < 24; i++) {
      hours.push(new Date(currentHour))
      currentHour = addHours(currentHour, 1)
    }
    return hours
  }

  const mapHoursToDaysOfWeek = (hours: Date[]): { hours: Date; hour: string }[] =>
    hours.map((hours) => ({ hours, hour: hours.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' }) }))

  const renderDayCalendar = () => {
    const hours = generateHours()
    const mappedHours = mapHoursToDaysOfWeek(hours)

    return (
      <div className='h-full max-h-[calc(100%_-_10vh)] overflow-hidden'>

        <div className='grid grid-cols-[auto,10fr]'>
          <button className='group min-w-[9ch] max-w-[9ch] grid place-items-center'>
            <IoAddCircle className='text-4xl text-sky-400 group-hover:scale-125 transition-transform' />
          </button>
          <ul className='w-full grid gap-4 p-4 grid-rows-1'>
            <Link href={'/'} key={currentDay.toISOString()} className={`flex flex-col items-center gap-3 transition-colors ${!isToday(currentDay) && 'hover:!text-slate-900'} ${isToday(currentDay) ? 'text-sky-400' : 'text-neutral-500'}`}>
              <span className='uppercase text-xs'>{format(currentDay, 'iii')}</span>
              <span className='text-2xl font-medium'>{format(currentDay, 'dd')}</span>
            </Link>
          </ul>
        </div>

        <main className='h-[calc(100%_-_5.75rem)] grid grid-cols-[auto,10fr] overflow-y-scroll hide-scroll'>
          <ul className='grid grid-rows-24 p-2 max-w-[9ch] min-w-[9ch]'>
            {mappedHours.map(({ hour }) => (
              <li key={hour} className='ml-auto gap-3 p-2'>
                <span className='uppercase text-xs text-neutral-500'>{hour}</span>
              </li>
            ))}
          </ul>
          <section id='dates-container' className='w-full grid grid-rows-24 p-2 overflow-hidden'>
              <div className='grid grid-cols-1 grid-rows-24 border-r border-gray-300 last:border-none'>
                {mappedHours.map(({ hour }) => (
                  <div id={`${hour}-${format(currentDay, 'EEEE-MMMM-dd')}`} key={`${hour}-${currentDay}`} className='border-b border-gray-300 last:border-none'>
                    <button onClick={() => createNewEvent(hour, format(currentDay, 'EEEE-MMMM-dd'))} className='w-full h-full hover:ring-[1px] hover:ring-sky-400'>
                      {eventNames[`${hour}-${format(currentDay, 'EEEE-MMMM-dd')}`] && 
                        <div className={`w-full h-full truncate grid place-items-center text-white font-medium text-sm ${eventNames[`${hour}-${format(currentDay, 'EEEE-MMMM-dd')}`].color}`}>
                          {eventNames[`${hour}-${format(currentDay, 'EEEE-MMMM-dd')}`].name.toString()}
                        </div>
                      }
                    </button>
                  </div>
                ))}
              </div>
            {eventModal && <EventModal clickedId={clickedId} eventNames={eventNames} setEventNames={setEventNames} setEventModal={setEventModal} removeEvent={removeEvent} />}
          </section>
        </main>

      </div>
    )
  }
  return renderDayCalendar()
}

export default RenderDayCalendar