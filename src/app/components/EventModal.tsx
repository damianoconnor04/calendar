'use client'
import React, { useEffect } from 'react'
import { IoCheckmark, IoRemove, IoTrash } from 'react-icons/io5'

interface EventModalProps { clickedId: string | null, eventNames: { [key: string]: string }, setEventNames: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>, setEventModal: React.Dispatch<React.SetStateAction<boolean>>, removeEvent: (id: string) => void }
const EventModal: React.FC<EventModalProps> = ({ clickedId, eventNames, setEventNames, setEventModal, removeEvent }) => {
  useEffect(() => {
    if (clickedId) {
      const savedEventName = localStorage.getItem(clickedId)
      if (savedEventName) {
        setEventNames(prevNames => ({ ...prevNames, [clickedId]: savedEventName }))
      }
    }
  }, [clickedId])

  const handleSave = () => { clickedId && localStorage.setItem(clickedId, eventNames[clickedId]) }
  const handleRemove = () => {
    clickedId && localStorage.removeItem(clickedId) 
    clickedId && removeEvent(clickedId)
    setEventModal(false)
  }

  if (clickedId === null) return null
  const eventElem = document.getElementById(`${clickedId}`)?.getBoundingClientRect()
  const containerElem = document.getElementById('dates-container')?.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  console.log(`eventNames: ${eventNames[0]}`)

  const [hour, month, dayOfWeek, date] = clickedId.split('-')

  let left = undefined
  let top = undefined
  if (containerElem && eventElem) {
    if (eventElem?.left - 384 < containerElem.width) { left = eventElem?.right }
    if (eventElem?.left + 384 > containerElem.width) { left = eventElem?.left - 384 }
    if (eventElem?.bottom + 128 > viewportHeight) { top = eventElem?.bottom - 128 }
    if (eventElem?.bottom + 128 < viewportHeight) { top = eventElem?.top }
    // else { return <MobileEventModal /> } 
    // TODO: If modal can't fit without overflow on X axis, display mobile modal
  }

  const handleEventNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setEventNames(prevNames => ({ ...prevNames, [clickedId]: e.target.value }))

  return (
    <div className='w-full max-w-sm max-h-32 h-full bg-white p-2 rounded-lg border border-gray-400' style={{ position: 'absolute', top: `${top}px`, left: `${left}px` }}>

      <div className='flex items-center justify-between'>
        
        <div className='flex gap-2 relative w-full'>
          <label htmlFor={`${hour}`} className='w-full'>
            <input value={eventNames[clickedId] || ''} onChange={handleEventNameChange} className='pr-16 w-full border-b-4 pt-1 pb-2 focus-visible:outline-none focus-visible:border-b-sky-400' />
          </label>
          <div className="absolute right-0 -top-0.5 flex items-center gap-2 p-1 rounded-lg border border-gray-400 bg-gray-200/50">
            <button onClick={handleSave} className='p-0.5 rounded-lg bg-sky-400 text-white font-medium text-xl'>
              <IoCheckmark />
            </button>
            <button onClick={handleRemove} className='p-0.5 rounded-lg bg-rose-400 text-white font-medium text-xl'>
              <IoTrash />
            </button>
          </div>
        </div>
      </div>

      <div className='flex items-start'>
        <div className='flex flex-col'>
          <time>{dayOfWeek}, {month} {date}</time>
        </div>
      </div>
    </div>
  );
};

export default EventModal