import React, { useEffect, useState } from 'react'
import { Moment } from 'moment'
import { IoAddCircle } from 'react-icons/io5'
import EventModal from './EventModal'

interface RenderCalendarProps { currentWeek: Moment, currentHours: Moment }
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
    setEventNames(prevNames => ({...prevNames, [id]: 'New event'}))
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
    const startDate = currentWeek.clone().startOf('week')
    const endDate = currentWeek.clone().endOf('week')
    const dates = []
    while (startDate.isSameOrBefore(endDate)) { dates.push(startDate.clone()); startDate.add(1, 'day') }
    return dates
  }

  const generateHours = () => {
    const firstHour = currentHours.clone().startOf('day')
    const lastHour = currentHours.clone().endOf('day')
    const hours = []
    while (firstHour.isSameOrBefore(lastHour)) { hours.push(firstHour.clone()); firstHour.add(1, 'hour') }
    return hours
  }

  const mapDatesToDaysOfWeek = (dates: Moment[]): { date: Moment; dayOfWeek: string }[] =>
    dates.map((date) => ({ date, dayOfWeek: date.format('ddd') }))
  const mapHoursToDaysOfWeek = (hours: Moment[]): { hours: Moment; hour: string }[] =>
    hours.map((hours) => ({ hours, hour: hours.format('h A') }))

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
              <li key={date.format('YYYY-MM-DD')} className='flex flex-col items-center gap-3'>
                <span className='uppercase text-xs text-neutral-500'>{dayOfWeek}</span>
                <span className='text-2xl font-medium text-neutral-500'>{date.format('D')}</span>
              </li>
            ))}
          </ul>
        </div>

        <main className='h-[calc(100%_-_5.75rem)] grid grid-rows-12 grid-cols-[1fr,15fr,1fr] overflow-y-scroll hide-scroll'>
          <div className='w-full grid grid-cols-1 grid-rows-12 p-2 whitespace-nowrap place-items-center'>
            {mappedHours.map(({ hour }) => (
              <li key={hour} className='flex flex-col items-end gap-3 p-2'>
                <span className='uppercase text-xs text-neutral-500'>{hour}</span>
              </li>
            ))}
          </div>
          <section id='dates-container' className='w-full grid grid-cols-7 grid-rows-12 p-2 overflow-hidden'>
            {mappedDates.map(({ date, dayOfWeek }) => (
              <div key={dayOfWeek} className='grid grid-cols-1 grid-rows-12 border-x'>
                {mappedHours.map(({ hour }) => (
                  <div id={`${hour}-${date.format('MMM-dddd-DD')}`} key={`${hour}-${date}`} className='border-b'>
                    <button onClick={() => createNewEvent(hour, date.format('MMM-dddd-DD'))} className='w-full h-full'>
                    {eventNames[`${hour}-${date.format('MMM-dddd-DD')}`] && <p className='w-full h-full grid place-items-center bg-sky-400 text-white font-medium text-sm'>{eventNames[`${hour}-${date.format('MMM-dddd-DD')}`]}</p>}
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