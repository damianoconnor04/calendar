import React, { useEffect } from 'react'
import { IoArrowForward, IoArrowForwardCircleOutline, IoCheckmark, IoTrash } from 'react-icons/io5'

interface EventModalProps { clickedId: string | null, eventNames: { [key: string]: string }, setEventNames: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>, setEventModal: React.Dispatch<React.SetStateAction<boolean>>, removeEvent: (id: string) => void }
const EventModal: React.FC<EventModalProps> = ({ clickedId, eventNames, setEventNames, setEventModal, removeEvent }) => {
  const colors = ['bg-sky-400', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500']

  useEffect(() => {
    if (clickedId) {
      const savedEventName = localStorage.getItem(clickedId)
      if (savedEventName) {
        setEventNames(prevNames => ({ ...prevNames, [clickedId]: savedEventName }))
      }
    }
  }, [clickedId])

  const handleSave = () => {
    clickedId && localStorage.setItem(clickedId, eventNames[clickedId])
    setEventModal(false)
  }
  const handleRemove = () => {
    clickedId && localStorage.removeItem(clickedId)
    clickedId && removeEvent(clickedId)
    setEventModal(false)
  }
  const setColor = () => {

  }

  if (clickedId === null) return null
  const eventElem = document.getElementById(`${clickedId}`)?.getBoundingClientRect()
  const containerElem = document.getElementById('dates-container')?.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  console.log(`eventNames: ${eventNames[0]}`)

  const [hour, dayOfWeek, month, date] = clickedId.split('-')

  const hourParts: string[] = hour.split(' ')
  const timestamp: string = hourParts[1]
  const hourInt: number = parseInt(hourParts[0])
  let nextHourInt: number = hourInt + 1; if (nextHourInt > 12) nextHourInt = 1
  const nextHour: string = nextHourInt + ' ' + timestamp

  let left = undefined
  let top = undefined
  if (containerElem && eventElem) {
    if (eventElem?.left - 384 < containerElem.width) { left = eventElem?.right } // no x overflow
    if (eventElem?.left + 384 > containerElem.width) { left = eventElem?.left - 384 } // modal width causes x overflow, switch side
    if (eventElem?.bottom + 128 < viewportHeight) { top = eventElem?.top } // no y overflow
    if (eventElem?.bottom + 128 > viewportHeight) { top = eventElem?.bottom - 128 } // modal height causes y overflow, go to top
    if (eventElem?.bottom > viewportHeight) { top = eventElem?.top - 128 } // only top of button is visible


    // else { return <MobileEventModal /> } 
    // TODO: If modal can't fit without overflow on X axis, display mobile modal
  }

  const handleEventNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setEventNames(prevNames => ({ ...prevNames, [clickedId]: e.target.value }))

  return (
    <div className='w-full max-w-sm max-h-32 h-full bg-white p-2 rounded-lg border border-gray-400' style={{ position: 'absolute', top: `${top}px`, left: `${left}px` }}>

      <div className='flex items-center justify-between text-sm text-neutral-700 cursor-default'>
        <div className='flex items-start'>
          <div className='flex flex-col'>
            <time>{dayOfWeek}, {month} {date}</time>
          </div>
        </div>
        <div className='flex py-2 items-center text-sm text-neutral-700 cursor-default'>
          <time>{hourInt}</time>
          <IoArrowForward className='text-sm p-0.5' />
          <time>{nextHour}</time>
        </div>
      </div>

      <div className='relative w-full'>
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

      <div className='flex items-center gap-0.5 py-2'>
        {colors.map((color, idx) => <button onClick={setColor} key={idx} className={`w-2 h-2 p-2 aspect-square rounded-full ${color}`} />)}
      </div>

    </div>

  )
}

export default EventModal