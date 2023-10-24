import React, { useEffect, useState } from 'react'
import Dropdown, { Option } from 'react-dropdown'
import { IoArrowForward, IoClose, IoTimeOutline } from 'react-icons/io5'
import Draggable from 'react-draggable'

const colors: Color[] = ['bg-sky-400', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500']
type Color = 'bg-sky-400' | 'bg-blue-500' | 'bg-purple-500' | 'bg-pink-500' | 'bg-red-500' | 'bg-orange-500' | 'bg-yellow-500' | 'bg-lime-500' | 'bg-green-500'

interface EventModalProps { clickedId: string | null, eventNames: { [key: string]: { name: string, color: Color } }, setEventNames: React.Dispatch<React.SetStateAction<{ [key: string]: { name: string, color: Color } }>>, setEventModal: React.Dispatch<React.SetStateAction<boolean>>, removeEvent: (id: string) => void }
const EventModal: React.FC<EventModalProps> = ({ clickedId, eventNames, setEventNames, setEventModal, removeEvent }) => {
  if (clickedId === null) return null
  useEffect(() => {
    const savedEventName = localStorage.getItem(clickedId)
    if (savedEventName) setEventNames(prevNames => ({ ...prevNames, [clickedId]: JSON.parse(savedEventName) }))
  }, [clickedId])

  const handleSave = () => {
    localStorage.setItem(clickedId, JSON.stringify({ name: eventNames[clickedId]?.name, color: eventNames[clickedId]?.color }))
    setEventModal(false)
  }
  const handleRemove = () => {
    localStorage.removeItem(clickedId)
    removeEvent(clickedId)
    setEventModal(false)
  }
  const handleModalClose = () => {
    setEventModal(false)
    const savedEvent = localStorage.getItem(clickedId)
    if (!localStorage.getItem(clickedId)) removeEvent(clickedId)
    if (savedEvent) if (JSON.parse(savedEvent).name === '') removeEvent(clickedId)
  }

  const [eventColor, setEventColor] = useState<Color>('bg-sky-400')
  const setColor = (color: Color) => {
    setEventColor(color)
    if (clickedId) setEventNames(prevNames => ({ ...prevNames, [clickedId]: { name: eventNames[clickedId]?.name || '', color: color } }))
  }

  const [hour, dayOfWeek, month, date] = clickedId.split('-')
  const hourParts: string[] = hour.split(' ')
  const timestamp: string = hourParts[1]
  const hourInt: number = parseInt(hourParts[0])
  let nextHourInt: number = hourInt + 1; if (nextHourInt > 12) nextHourInt = 1
  const nextHour: string = nextHourInt + ' ' + timestamp

  const handleEventNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setEventNames(prevNames => ({ ...prevNames, [clickedId]: { name: e.target.value, color: eventNames[clickedId]?.color } }))

  const eventElem = document.getElementById(`${clickedId}`)?.getBoundingClientRect()
  const containerElem = document.getElementById('dates-container')?.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  let left = undefined
  let top = undefined
  if (containerElem && eventElem) {
    if (eventElem?.left - 384 < containerElem.width) { left = eventElem?.right - 16 } // no x overflow, go to right
    if (eventElem?.right + 384 > containerElem.width) { left = eventElem?.left - 368 } // modal width causes x overflow, go to left (minus modal width)
    if (eventElem?.bottom + 384 < viewportHeight) { top = eventElem?.bottom - 16 } // no y overflow, go to bottom
    if (eventElem?.bottom + 384 > viewportHeight) { top = eventElem?.top - 368 } // modal height causes y overflow, go to top (minus modal height)
  }

  const hourOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i === 0 || i === 12 ? 12 : i % 12;
    const timestamp = i < 12 ? 'AM' : 'PM';
    return `${hour} ${timestamp}`
  })
  const handleFirstHourChange = (e: Option) => { }

  type Type = 'event' | 'task'
  const [type, setType] = useState<Type>('event')

  return (
    <>
      <div onClick={handleModalClose} className='animate-fade animate-duration-200 absolute inset-0 w-full h-full bg-neutral-600/5' />
      <Draggable handle='.handle' bounds='body'>
      <div className={`animate-fade animate-duration-200 animate-delay-50 w-full max-w-sm max-h-96 h-full bg-white rounded-xl flex flex-col shadow z-[9999]`} style={{ position: 'absolute', top: `${top}px`, left: `${left}px` }}>
        <header className='handle cursor-move bg-[#f1f3f4] border-b border-b-[#f1f3f4] flex justify-end rounded-t-xl p-1'>
          <button onClick={() => handleModalClose()} className='p-0.5 text-xl text-[#73767a] hover:bg-[#e6e8e9] transition-colors rounded-full'><IoClose /></button>
        </header>

        <div className='flex flex-1 flex-col p-2'>
          <label htmlFor={`${hour}`} className='self-end max-w-[calc(90%_-_0.75rem)]'>
            <input value={eventNames[clickedId].name.toString()} placeholder='New event' onChange={handleEventNameChange} className='pr-16 text-xl w-full border-b-2 border-b-gray-400/70 focus-visible:outline-none focus-visible:border-b-sky-400' />
          </label>

          <div className='flex items-center pt-3 pb-1 gap-2 ml-[calc(10%_+_0.75rem)]'>
            <button onClick={() => setType('event')} className={`text-sm transition-colors px-3 py-1.5 rounded-md text-neutral-600 font-medium ${type === 'event' ? 'bg-indigo-100/60 !text-blue-600' : 'hover:bg-neutral-500/10'}`}>Event</button>
            <button onClick={() => setType('task')} className={`text-sm transition-colors px-3 py-1.5 rounded-md text-neutral-600 font-medium ${type === 'task' ? 'bg-indigo-100/60 !text-blue-600' : 'hover:bg-neutral-500/10'}`}>Task</button>
          </div>

          <div className='flex items-center text-sm text-neutral-700 cursor-default py-0.5 gap-2'>
            <span className='min-w-[10%] max-w-[10%]'>
              <IoTimeOutline className='text-2xl m-auto' />
            </span>

            <div className='flex items-center w-full justify-between'>
              <button className='py-0.5 px-1 hover:bg-neutral-500/10 rounded-lg'>{dayOfWeek}, {month} {date}</button>

              <div className='flex items-center'>
                <button className='hover:bg-neutral-500/10 rounded-lg transition-colors'>
                  <Dropdown
                    arrowClassName='!hidden'
                    controlClassName='!max-w-fit !bg-inherit !cursor-pointer !px-1 !py-0.5 !shadow-none !border-transparent ring-1 ring-transparent hover:!ring-sky-400 !transition-colors !text-neutral-600 !rounded-lg'
                    className='!max-w-fit'
                    menuClassName='!border-none !bg-white !w-max !overflow-x-hidden !max-h-[4.375rem]'
                    options={hourOptions}
                    value={hourInt + ' ' + timestamp}
                    onChange={(e) => handleFirstHourChange(e)}
                  />
                </button>
                <IoArrowForward className='p-0.5 pt-1 text-lg' />
                <button className='hover:bg-neutral-500/10 rounded-lg transition-colors'>
                  <Dropdown
                    arrowClassName='!hidden'
                    controlClassName='!max-w-fit !bg-inherit !cursor-pointer !px-1 !py-0.5 !shadow-none !border-transparent ring-1 ring-transparent hover:!ring-sky-400 !transition-colors !text-neutral-600 !rounded-lg'
                    className='!max-w-fit'
                    menuClassName='!border-none !bg-white !w-max !overflow-x-hidden !max-h-[4.375rem]'
                    options={hourOptions}
                    value={nextHour}
                    onChange={(e) => handleFirstHourChange(e)}
                  />
                </button>
              </div>

            </div>

          </div>

        </div>

        <div className='flex items-center gap-1 ml-[calc(10%_+_1.25rem)] py-2'>
          {colors.map((color, idx) => <button onClick={() => setColor(color)} key={idx} className={`w-4 h-4 aspect-square rounded-full ${color}`} />)}
        </div>

        <footer className='bg-white border-t border-t-[#f1f3f4] flex justify-end gap-2 rounded-b-xl p-1'>
          <button onClick={handleRemove} className='py-1 px-3 rounded-lg bg-rose-400 text-white font-medium text-sm'>Delete</button>
          <button onClick={handleSave} className='py-1 px-3 rounded-lg bg-sky-400 text-white font-medium text-sm'>Save</button>
        </footer>
      </div>
      </Draggable>
    </>
  )
}

export default EventModal