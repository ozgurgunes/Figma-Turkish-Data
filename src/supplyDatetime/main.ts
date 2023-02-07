import {
  orderAscendingTime,
  orderAscendingdDateTime,
  orderRandomDateTime,
  orderRandomTime,
  getSelectedTextNodes,
  dateTimeFormats,
  orderDescendingDateTime,
  orderDescendingTime,
} from '../utils'

import {
  on,
  showUI,
  setRelaunchButton,
  EventHandler,
} from '@create-figma-plugin/utilities'

type DateFormat =
  | 'HhMm'
  | 'HhMmSs'
  | 'DdMmYY'
  | 'DdMmYyyy'
  | 'DdMmmYyyy'
  | 'DdMmmmYyyy'
  | 'DdMmmmYyyyDddd'
  | 'DdMmYyHhMm'
  | 'DdMmYyyyHhMm'
  | 'DdMmmmYyyyDdddHhMm'

export interface Options {
  order: string,
  range: string,
  start: string
}

export interface DateHandler extends EventHandler {
  name:
    | 'HHMM'
    | 'HHMMSS'
    | 'DDMMYY'
    | 'DDMMYYYY'
    | 'DDMMMYYYY'
    | 'DDMMMMYYYY'
    | 'DDMMMMYYYYDDDD'
    | 'DDMMYYHHMM'
    | 'DDMMYYYYHHMM'
    | 'DDMMMMYYYYDDDDHHMM'

  handler: (options: Options) => void
}

/* 
{
  'HhMm': 'HH:mm'
  'HhMmSs': 'HH:mm:SS'
  'DdMmYY': 'dd.MM.yy'
  'DdMmYyyy': 'dd.MM.yyyy'
  'DdMmmYyyy': 'dd MMM yyyy'
  'DdMmmmYyyy': 'dd MMMM yyyy'
  'DdMmmmYyyyDddd': 'dd MMMM yyyy dddd'
  'DdMmYyHhMm': 'dd.MM.yy HH:mm'
  'DdMmYyyyHhMm': 'dd.MM.yyyy HH:mm'
  'DdMmmmYyyyDdddHhMm': 'dd MMMM yyyy dddd HH:mm'
}
*/

export default async function (): Promise<void> {
  setRelaunchButton(figma.currentPage, 'turkishDateTime')
  const lastOrder = await figma.clientStorage.getAsync('datetime.lastOrder')
  const lastRange = await figma.clientStorage.getAsync('datetime.lastRange')
  on<DateHandler>('HHMM', options => {
    getDates(getTimeArray, 'HhMm', options)
  })
  on<DateHandler>('HHMMSS', options => {
    getDates(getTimeArray, 'HhMmSs', options)
  })
  on<DateHandler>('DDMMYY', options => {
    getDates(getDateTimeArray, 'DdMmYY', options)
  })
  on<DateHandler>('DDMMYYYY', options => {
    getDates(getDateTimeArray, 'DdMmYyyy', options)
  })
  on<DateHandler>('DDMMMYYYY', options => {
    getDates(getDateTimeArray, 'DdMmmYyyy', options)
  })
  on<DateHandler>('DDMMMMYYYY', options => {
    getDates(getDateTimeArray, 'DdMmmmYyyy', options)
  })
  on<DateHandler>('DDMMMMYYYYDDDD', options => {
    getDates(getDateTimeArray, 'DdMmmmYyyyDddd', options)
  })
  on<DateHandler>('DDMMYYHHMM', options => {
    getDates(getDateTimeArray, 'DdMmYyHhMm', options)
  })
  on<DateHandler>('DDMMYYYYHHMM', options => {
    getDates(getDateTimeArray, 'DdMmYyyyHhMm', options)
  })
  on<DateHandler>('DDMMMMYYYYDDDDHHMM', options => {
    getDates(getDateTimeArray, 'DdMmmmYyyyDdddHhMm', options)
  })
  showUI(
    {
      width: 240,
      height: 600,
    },
    { lastOrder: lastOrder, lastRange: lastRange }
  )
}

async function getDates(
  dateArrayFunction: Function,
  format: DateFormat,
  options: Options
) {
  let supplierFunction: Function
  switch (options.order) {
    case 'random':
      supplierFunction =
        dateArrayFunction == getDateTimeArray
          ? orderRandomDateTime
          : orderRandomTime
      break
    case 'ascending':
      supplierFunction =
        dateArrayFunction == getDateTimeArray
          ? orderAscendingdDateTime
          : orderAscendingTime
      break
    case 'descending':
      supplierFunction =
        dateArrayFunction == getDateTimeArray
          ? orderDescendingDateTime
          : orderDescendingTime
      break
    default:
      break
  }
  const selectedNodes = getSelectedTextNodes()
  const dates = dateArrayFunction(selectedNodes.length, options)
  selectedNodes.forEach((textNode, i) => {
    figma.loadFontAsync(textNode.fontName as FontName).then(() => {
      textNode.characters = supplierFunction(dates, dateTimeFormats[format])[i]
    })
  })
  figma.clientStorage.setAsync('datetime.lastOrder', options.order)
  figma.clientStorage.setAsync('datetime.lastRange', options.range)
}

function getDateTimeArray(arrayLength: number, options: Options): Date[] {
  let start = new Date(Date.parse(options.start))
  let end = start
  let modifier = options.order == 'ascending' ? 1 : -1
  //start = Date.parse(optionStart)
  //let end = new Date(new Date().setFullYear(start.getFullYear() - 2))
  switch (options.range) {
    case 'hour':
      end = new Date(new Date().setHours(start.getHours() - (1 * modifier)))
      break
    case 'day':
      end = new Date(Number(start) - (24 * 60 * 60 * 1000 * modifier))
      break
    case 'month':
      end = new Date(new Date().setMonth(start.getMonth() - (1 * modifier)))
      break
    default:
      end = new Date(new Date().setFullYear(start.getFullYear() - (1 * modifier)))
      break
  }
  let range = options.order == 'ascending' ? start.getTime() - end.getTime() : end.getTime() - start.getTime()
  let dates: Date[] = []
  let i = 0
  while (i < arrayLength) {
    dates.push(new Date(start.getTime() + (Math.random() * range * modifier)))
    i++
  }
  return dates
}

function getTimeArray(arrayLength: number, options: Options) {
  let start = new Date(Date.parse(options.start))
  let end = start
  let modifier = options.order == 'ascending' ? 1 : -1
  //start = Date.parse(optionStart)
  //let end = new Date(new Date().setFullYear(start.getFullYear() - 2))
  switch (options.range) {
    case 'hour':
      end = new Date(new Date().setHours(start.getHours() - (1 * modifier)))
      break
    case 'day':
      end = new Date(Number(start) - (24 * 60 * 60 * 1000 * modifier))
      break
    case 'month':
      end = new Date(new Date().setMonth(start.getMonth() - (1 * modifier)))
      break
    default:
      end = new Date(new Date().setFullYear(start.getFullYear() - (1 * modifier)))
      break
  }
  let range = options.order == 'ascending' ? start.getTime() - end.getTime() : end.getTime() - start.getTime()
  let times = []
  let i = 0
  while (i < arrayLength) {
    times.push(new Date(start.getTime() + (Math.random() * range * modifier)))
    i++
  }
  return times
}

// DATE & TIME

const timeOptions = {
  /* 
  options: {
    weekday: 'long', // long, short, narrow
    year: 'numeric', // numeric, 2-digit
    month: 'long', // numeric, 2-digit, long, short, narrow
    day: 'numeric', // numeric, 2-digit
    hour: 'numeric', // numeric, 2-digit
    minute: 'numeric', // numeric, 2-digit
    second: 'numeric', // numeric, 2-digit
    hour12: false,
  },
 */
  HhMm: {
    hour: '2-digit',
    minute: '2-digit',
  },
  HhMmSs: {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  },
  DdMmYY: {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  },
  DdMmYyyy: {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  },
  DdMmmYyyy: {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  },
  DdMmmmYyyy: {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  },
  DdMmmmYyyyDddd: {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  },
  DdMmYyHhMm: {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  },
  DdMmYyyyHhMm: {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },
  DdMmmmYyyyDdddHhMm: {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'long',
  },
}
