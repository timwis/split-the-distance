  import { add, roundToNearestMinutes, format } from 'date-fns'

  export function aboutAnHourFromNow () {
    const oneHourFromNow = add(new Date(), { hours: 1 })
    return roundToNearestMinutes(oneHourFromNow, { nearestTo: 15 })
  }
  
  export function formatDateForInput (date: Date) {
    // datetime-local inputs cannot have a timezone
    return format(date, `yyyy-MM-dd'T'HH:mm`)
  }
