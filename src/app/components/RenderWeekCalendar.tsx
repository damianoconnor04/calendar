import React, { useEffect, useState } from 'react'
import { IoAddCircle } from 'react-icons/io5'
import EventModal from './EventModal'
import { startOfWeek, endOfWeek, addDays, format, isToday, setHours, addHours, setMinutes } from 'date-fns'
import Link from 'next/link'

type Color = 'bg-sky-400' | 'bg-blue-500' | 'bg-purple-500' | 'bg-pink-500' | 'bg-red-500' | 'bg-orange-500' | 'bg-yellow-500' | 'bg-lime-500' | 'bg-green-500'

interface RenderWeekCalendarProps { currentWeek: Date }
const RenderWeekCalendar: React.FC<RenderWeekCalendarProps> = ({ currentWeek }) => {
  useEffect(() => {
    const savedEventNames: { [key: string]: { name: string, color: Color, start: string, end: string, repeat: string, isCopy: boolean, copyOf: string } } = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) savedEventNames[key] = JSON.parse(localStorage.getItem(key) ?? '')
    }
    setEventNames(savedEventNames)
  }, [])
  const [clickedId, setClickedId] = useState<string | null>(null)
  const [eventModal, setEventModal] = useState<boolean>(false)
  const [eventNames, setEventNames] = useState<{ [key: string]: { name: string, color: Color, start: string, end: string, repeat: string, isCopy: boolean, copyOf: string } }>({})

  const generateEventId = (start: string, end: string, date: string) => { 
    const id = `${start}-${end}-${date}`
    return id
  }

  const createNewEvent = (hour: string, date: string) => {
    const hourParts: string[] = hour.split(' ')
    const timestamp: string = hourParts[1].toLowerCase()
    const hourInt: number = parseInt(hourParts[0])
    let nextHourInt: number = hourInt + 1; if (nextHourInt > 12) nextHourInt = 1
    const nextHour = nextHourInt + ':00' + timestamp

    const id = generateEventId(hourInt + ':00' + timestamp, nextHour, date)
    setClickedId(id)

    if (!eventNames[id]) setEventNames(prevNames => ({ ...prevNames, [id]: { name: '', color: 'bg-sky-400', start: hourInt + ':00' + timestamp, end: nextHour, repeat: 'Does not repeat', isCopy: false, copyOf: '' } }))
    setEventModal(true)
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
    const hours = []
    let currentHour = setHours(new Date(setMinutes(new Date(), 0)), 0)
    for (let i = 0; i < 24; i++) {
      hours.push(new Date(currentHour))
      currentHour = addHours(currentHour, 1)
    }
    return hours
  }

  const getNextHour = (hour: string) => {
    const hourParts: string[] = hour.split(' ')
    const timestamp: string = hourParts[1].toLowerCase()
    const hourInt: number = parseInt(hourParts[0])
    let nextHourInt: number = hourInt + 1; if (nextHourInt > 12) nextHourInt = 1
    const nextHour = nextHourInt + ':00' + timestamp
    return nextHour
  }
  const formatHour = (hour: string) => {
    const hourParts: string[] = hour.split(' ')
    const timestamp: string = hourParts[1].toLowerCase()
    return hourParts[0] + timestamp
  }

  const mapDatesToDaysOfWeek = (dates: Date[]): { date: Date; dayOfWeek: string }[] =>
    dates.map((date) => ({ date, dayOfWeek: date.toLocaleDateString(undefined, { weekday: 'short' }) }))

  const mapHoursToDaysOfWeek = (hours: Date[]): { hours: Date; hour: string }[] =>
    hours.map((hours) => ({ hours, hour: hours.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' }) }))

  const calculateCellPosition = (startTime: string, endTime: string) => {
    const [startHour, startMinute] = startTime.split(':')
    const [endHour, endMinute] = endTime.split(':')
    const startHourInt = parseInt(startHour)
    const endHourInt = parseInt(endHour)
    const startMinutes = startHourInt === 12 ? 0 + parseInt(startMinute) : startHourInt * 60 + parseInt(startMinute)
    const endMinutes = endHourInt === 12 ? 0 + parseInt(endMinute) : endHourInt * 60 + parseInt(endMinute)
    const cellHeight = 100 / 1440
    const top = startMinutes * cellHeight
    const height = (endMinutes - startMinutes) * cellHeight
    return { top, height }
  }

  const renderWeekCalendar = () => {
    const dates = generateDates()
    const hours = generateHours()
    const mappedDates = mapDatesToDaysOfWeek(dates)
    const mappedHours = mapHoursToDaysOfWeek(hours)

    return (
      <div className='h-full max-h-[calc(100%_-_10vh)] overflow-hidden'>

        <div className='grid grid-cols-[auto,10fr]'>
          <button className='group min-w-[8ch] max-w-[8ch] grid place-items-center'>
            <IoAddCircle className='text-4xl text-sky-400 group-hover:scale-125 transition-transform' />
          </button>
          <ul className='w-full grid grid-cols-7 gap-4 p-4 grid-rows-1'>
            {mappedDates.map(({ date, dayOfWeek }) => (
              <Link href={{ pathname: '/day', query: { date: date.toISOString() } }} key={date.toISOString()} className={`flex flex-col items-center gap-3 transition-colors ${!isToday(date) && 'hover:!text-slate-900'} ${isToday(date) ? 'text-sky-400' : 'text-neutral-500'}`}>
                <span className='uppercase text-xs'>{dayOfWeek}</span>
                <span className='text-2xl font-medium'>{date.getDate()}</span>
              </Link>
            ))}
          </ul>
        </div>

        <main className='h-[calc(100%_-_5.75rem)] grid grid-cols-[auto,10fr] overflow-y-scroll hide-scroll'>
          <ul className='grid grid-rows-24 p-2 max-w-[8ch] min-w-[8ch]'>
            {mappedHours.map(({ hour }) => (
              <li key={hour} className='ml-auto h-10 max-h-10 min-h-10 flex justify-center items-center'>
                <span className='uppercase text-xs text-neutral-500'>{hour}</span>
              </li>
            ))}
          </ul>
          <section id='dates-container' className='w-full grid grid-cols-7 grid-rows-24 p-2 overflow-hidden'>
            {mappedDates.map(({ date, dayOfWeek }) => (
              <div key={dayOfWeek} className='grid grid-cols-1 relative grid-rows-24 border-r border-gray-300 last:border-r-0'>
                {Array.from({ length: 168 }, (_, idx) => { /* overlay horizontal grid for hours */
                  const row = Math.floor(idx / 7) + 1
                  const col = (idx % 7) + 1
                  return (
                    <div key={idx} className='absolute w-full border-b border-gray-300' style={{
                      top: `${((row - 1) / 24) * 100}%`,
                      left: `${((col - 1) / 7) * 100}%`,
                      height: `${100 / 24}%`,
                      width: `${100 / 7}%`,
                    }} />
                  )
                })}
                {mappedHours.map(({ hour }, idx) => {
                  const id = generateEventId(formatHour(hour), getNextHour(hour), format(date, 'EEEE/MMMM/dd'))
                  const event = eventNames[id]
                  if (event) {
                    const { top, height } = calculateCellPosition(event.start, event.end)
                    return (
                      <button id={id} key={id} className='absolute w-full z-[9999]' style={{ top: `${top}%`, height: `${height}%` }} onClick={() => createNewEvent(hour, format(date, 'EEEE/MMMM/dd'))}>
                        <div className={`w-full h-full truncate grid place-items-center text-white font-medium text-sm ${event.color}`}>
                          {event.name.toString() !== '' ? event.name.toString() : 'New event'}
                        </div>
                      </button>
                    )
                  }
                  return <button id={id} key={id} className='absolute w-full max-h-10' style={{ top: `${idx * 100 / 24}%`, height: '100%' }} onClick={() => createNewEvent(hour, format(date, 'EEEE/MMMM/dd'))} />
                })}
              </div>
            ))}
            {eventModal && <EventModal clickedId={clickedId} eventNames={eventNames} setEventNames={setEventNames} setEventModal={setEventModal} />}
          </section>
        </main>
      </div>
    )
  }
  return renderWeekCalendar()
}

export default RenderWeekCalendar