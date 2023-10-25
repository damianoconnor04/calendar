import React, { useEffect, useState } from 'react'
import Dropdown, { Option } from 'react-dropdown'
import { IoCaretDown, IoClose, IoInformationCircleOutline, IoRemove, IoTimeOutline } from 'react-icons/io5'
import { RxDividerVertical } from 'react-icons/rx'
import Draggable from 'react-draggable'
import { addDays, format, getMonth } from 'date-fns'

const colors: Color[] = ['bg-sky-400', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500']
type Color = 'bg-sky-400' | 'bg-blue-500' | 'bg-purple-500' | 'bg-pink-500' | 'bg-red-500' | 'bg-orange-500' | 'bg-yellow-500' | 'bg-lime-500' | 'bg-green-500'

interface EventModalProps { clickedId: string | null, eventNames: { [key: string]: { name: string, color: Color, start: string, end: string } }, setEventNames: React.Dispatch<React.SetStateAction<{ [key: string]: { name: string, color: Color, start: string, end: string } }>>, setEventModal: React.Dispatch<React.SetStateAction<boolean>>, removeEvent: (start: string, end: string, date: string) => void }
const EventModal: React.FC<EventModalProps> = ({ clickedId, eventNames, setEventNames, setEventModal, removeEvent }) => {
  if (clickedId === null) return null
  useEffect(() => {
    const savedEventName = localStorage.getItem(clickedId)
    if (savedEventName) setEventNames(prevNames => ({ ...prevNames, [clickedId]: JSON.parse(savedEventName) }))
  }, [clickedId])
  const [start, end, date] = clickedId.split('-')
  const [dayOfWeek, month, dayInt] = date.split('/')
  const generateEventId = (start: string, end: string, date: string) => { return `${start}-${end}-${date}` }

  const handleSave = () => {
    if (eventNames[clickedId].name) {
      localStorage.setItem(clickedId, JSON.stringify({ name: eventNames[clickedId]?.name, color: eventNames[clickedId]?.color, start: eventNames[clickedId]?.start, end: eventNames[clickedId]?.end }))
      setEventModal(false)
    }
    else { alert('Name your event before saving') }
  }
  const handleRemove = () => {
    localStorage.removeItem(clickedId)
    removeEvent(start, end, date)
    setEventModal(false)
  }
  const handleModalClose = () => {
    setEventModal(false)
    const savedEvent = localStorage.getItem(clickedId)
    if (!localStorage.getItem(clickedId)) removeEvent(start, end, date)
    if (savedEvent) if (JSON.parse(savedEvent).name === '') removeEvent(start, end, date)
  }

  const [eventColor, setEventColor] = useState<Color>('bg-sky-400')
  const setColor = (color: Color) => {
    setEventColor(color)
    if (clickedId) setEventNames(prevNames => ({ ...prevNames, [clickedId]: { name: eventNames[clickedId]?.name || '', color: color, start: eventNames[clickedId]?.start || '', end: eventNames[clickedId]?.end || '' } }))
  }

  const handleEventNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setEventNames(prevNames => ({ ...prevNames, [clickedId]: { name: e.target.value, color: eventNames[clickedId]?.color, start: eventNames[clickedId]?.start || '', end: eventNames[clickedId]?.end || '' } }))

  const eventElem = document.getElementById(`${clickedId}`)?.getBoundingClientRect()
  const containerElem = document.getElementById('dates-container')?.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  let left = undefined
  let top = undefined
  if (containerElem && eventElem) {
    if (eventElem?.left - 384 < containerElem.width) { left = eventElem?.right - 16 } // no x overflow, go to right
    if (eventElem?.right + 400 > containerElem.width) { left = eventElem?.left - 368 } // modal width causes x overflow, go to left (minus modal width)
    if (eventElem?.bottom + 288 < viewportHeight) { top = eventElem?.bottom - 16 } // no y overflow, go to bottom
    if (eventElem?.bottom + 304 > viewportHeight) { top = eventElem?.top - 288 } // modal height causes y overflow, go to top (minus modal height)
  }

  const [selectedFirstHour, setSelectedFirstHour] = useState<string>(eventNames[clickedId]?.start || '')
  const hourOptions = Array.from({ length: 96 }, (_, idx) => {
    const hour24 = Math.floor(idx / 4)
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12
    const minute = (idx % 4) * 15
    const timestamp = hour24 < 12 ? 'am' : 'pm'
    return `${hour12}:${minute < 10 ? '0' + minute : minute}${timestamp}`
  })
  const secondHourOptions = () => {
    const firstHourIdx = hourOptions.indexOf(selectedFirstHour)
    return hourOptions.slice(firstHourIdx + 1)
  }

  const handleFirstHourChange = (e: Option) => {
    setEventNames(prevNames => ({ ...prevNames, [clickedId]: { name: eventNames[clickedId]?.name || '', color: eventNames[clickedId]?.color || '', start: e.value, end: eventNames[clickedId]?.end || '' } }))
    setSelectedFirstHour(e.value)
  }
  const handleSecondHourChange = (e: Option) => setEventNames(prevNames => ({ ...prevNames, [clickedId]: { name: eventNames[clickedId]?.name || '', color: eventNames[clickedId]?.color || '', start: eventNames[clickedId]?.start || '', end: e.value } }))

  const repeatOptions = ['Does not repeat', 'Daily', 'Weekly', 'Weekdays']
  const monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]
  const monthIndex = monthNames.indexOf(month)
  const handleRepeatChange = (e: Option) => {
    const option = e.value
    const event = eventNames[clickedId]
    if (option === 'Does not repeat') {}
    if (option === 'Daily') {
      for (let i = 1; i <= 7; i++) {
        const newDate = new Date(new Date().getFullYear(), monthIndex, parseInt(dayInt) + i)
        const newId = generateEventId(event.start, event.end, format(newDate, 'EEEE/MMMM/dd'))
        setEventNames(prevNames => ({ ...prevNames, [newId]: event }))
      }
    }
  }

  type Type = 'event' | 'task'
  const [type, setType] = useState<Type>('event')

  return (
    <>
      <div onClick={handleModalClose} className='animate-fade animate-duration-200 absolute inset-0 w-full h-full bg-neutral-600/5' />
      <Draggable handle='.handle' bounds='body'>
        <div className={`animate-fade animate-duration-200 animate-delay-50 w-full max-w-sm max-h-72 h-full bg-white rounded-xl flex flex-col shadow z-[9999]`} style={{ position: 'absolute', top: `${top}px`, left: `${left}px` }}>
          <header className='handle cursor-move bg-[#f1f3f4] border-b border-b-[#f1f3f4] flex justify-end rounded-t-xl p-1'>
            <button onClick={() => handleModalClose()} className='p-0.5 text-xl text-[#73767a] hover:bg-[#e6e8e9] transition-colors rounded-full'><IoClose /></button>
          </header>

          <div className='flex flex-1 flex-col p-2'>
            <label htmlFor={`${clickedId}`} className='self-end max-w-[calc(90%_-_0.75rem)]'>
              <input value={eventNames[clickedId].name.toString()} placeholder='New event' onChange={handleEventNameChange} className='pr-16 text-xl w-full border-b-2 border-b-gray-400/70 focus-visible:outline-none focus-visible:border-b-sky-400' />
            </label>

            <div className='flex items-center pt-3 pb-1 gap-2 ml-[calc(10%_+_0.75rem)]'>
              <button onClick={() => setType('event')} className={`text-sm transition-colors px-3 py-1.5 rounded-md text-neutral-600 font-medium ${type === 'event' ? 'bg-indigo-100/60 !text-blue-600' : 'hover:bg-neutral-500/10'}`}>Event</button>
              <button onClick={() => setType('task')} className={`text-sm transition-colors px-3 py-1.5 rounded-md text-neutral-600 font-medium ${type === 'task' ? 'bg-indigo-100/60 !text-blue-600' : 'hover:bg-neutral-500/10'}`}>Task</button>
            </div>

            <div className='flex items-start text-sm text-neutral-700 cursor-default py-0.5 gap-2'>
              <span className='min-w-[10%] max-w-[10%] mt-1'>
                <IoTimeOutline className='text-2xl m-auto' />
              </span>

              <div className="flex flex-col w-full">
                <div className='flex items-center gap-0'>
                  <button className='hover:bg-neutral-500/10 rounded-t-md text-neutral-600 p-1 border-b border-b-transparent hover:!border-sky-400 transition-colors'>
                    {month + ' ' + dayInt}
                  </button>
                  <RxDividerVertical className='text-lg text-neutral-600' />
                  <div className='flex items-center'>
                    <button className='hover:bg-neutral-500/10 rounded-t-md transition-colors'>
                      <Dropdown
                        arrowClassName='!hidden'
                        controlClassName='!max-w-fit !bg-inherit !cursor-pointer !p-1 !shadow-none !border-transparent hover:!border-b-sky-400 !transition-colors !text-neutral-600 !rounded-t-md'
                        className='!max-w-fit'
                        menuClassName='!border-none !bg-[#FaF9F9] !w-max !overflow-x-hidden !max-h-40'
                        options={hourOptions}
                        value={eventNames[clickedId]?.start || ''}
                        onChange={(e) => handleFirstHourChange(e)}
                      />
                    </button>
                    {type === 'event' && (
                      <>
                        <IoRemove />
                        <button className='hover:bg-neutral-500/10 rounded-t-md transition-colors'>
                          <Dropdown
                            arrowClassName='!hidden'
                            controlClassName='!max-w-fit !bg-inherit !cursor-pointer !p-1 !shadow-none !border-transparent hover:!border-b-sky-400 !transition-colors !text-neutral-600 !rounded-t-md'
                            className='!max-w-fit'
                            menuClassName='!border-none !bg-[#FaF9F9] !w-max !overflow-x-hidden !max-h-40'
                            options={secondHourOptions()}
                            value={eventNames[clickedId]?.end || ''}
                            onChange={(e) => handleSecondHourChange(e)}
                          />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <button className='hover:bg-neutral-500/10 rounded-md transition-colors w-fit'>
                  <Dropdown
                    arrowClosed={<IoCaretDown className='text-xs' />}
                    arrowOpen={<IoCaretDown className='text-xs' />}
                    controlClassName='!bg-inherit !cursor-pointer !p-1 !shadow-none !border-transparent transition-colors !text-neutral-600 flex items-center gap-2'
                    menuClassName='!border-none !bg-[#FaF9F9] !max-h-32 !overflow-x-hidden !w-max'
                    options={repeatOptions}
                    value={'Does not repeat'}
                    onChange={(e) => handleRepeatChange(e)}
                  />
                </button>

              </div>
            </div>

            <div className='flex items-start text-sm text-neutral-700 cursor-default py-0.5 pt-2 gap-2'>
              <span className='min-w-[10%] max-w-[10%]'>
                <IoInformationCircleOutline className='text-2xl m-auto' />
              </span>
              <textarea placeholder='Add description' className='resize-none w-full bg-[#FaF9F9] p-0.5 px-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 border border-gray-300' />
            </div>

          </div>

          <div className='flex items-center gap-1 ml-auto p-2 pt-0'>
            {colors.map((color, idx) => <button onClick={() => setColor(color)} key={idx} className={`w-4 h-4 aspect-square rounded-full ${color}`} />)}
          </div>

          <footer className='bg-[#f1f3f4] border-t border-t-[#f1f3f4] flex justify-end gap-3 rounded-b-xl p-1'>
            <button onClick={handleRemove} className='p-0.5 rounded-lg text-rose-400 font-medium text-sm'>Remove</button>
            <button onClick={handleSave} className='p-0.5 px-3 rounded-lg bg-sky-400 text-white font-medium text-sm'>Save</button>
          </footer>
        </div>
      </Draggable>
    </>
  )
}

export default EventModal