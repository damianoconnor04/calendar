A calendar app with very limited functionality  

Built with Next 13 & Moment.js  
Persistence relies on localStorage cache; no accounts, tokens, or cookies yet

**Current:**  
- Below and above 1 hour events  
- Rename, save, or delete events
- Change color of events  
- Change time of an event
- Drag event creation modal 
- Repeat event (daily)   

**Future:**  
- Repeat event (weekly, weekdays, weekends, etc)  
- Drag and drop events  

**Current bugs:**
- Day calendar is broken and hasn't been touched in days, i fix later
- Only first 12 hours map event to correct spot on week calendar because of non 24h times (events themselves in localstorage have the correct timestamp regardless)
- Tasks remain the corresponding height to their last input starting and ending hours instead of becoming a uniform size
- Adding description doesn't save anywhere yet