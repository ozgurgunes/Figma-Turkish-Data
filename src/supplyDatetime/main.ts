import {
  orderAscendingTime,
  orderAscendingdDateTime,
  orderRandomDateTime,
  orderRandomTime,
  getSelectedTextNodes,
  dateTimeFormats,
  orderDescendingDateTime,
  orderDescendingTime,
  supplyData,
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

export interface PluginOptions {
  order: string
  range: string
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

  handler: (options: PluginOptions) => void
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
  let lastOptions = {
    order: await figma.clientStorage.getAsync('datetime.order'),
    range: await figma.clientStorage.getAsync('datetime.range'),
  }

  function supplyDatetime(
    supplierFunction: Function,
    format: DateFormat,
    options: PluginOptions
  ) {
    let orderFunction: Function
    switch (options.order) {
      case 'ascending':
        orderFunction =
          supplierFunction == getDateTimeArray
            ? orderAscendingdDateTime
            : orderAscendingTime
        break
      case 'descending':
        orderFunction =
          supplierFunction == getDateTimeArray
            ? orderDescendingDateTime
            : orderDescendingTime
        break
      default:
        orderFunction =
          supplierFunction == getDateTimeArray
            ? orderRandomDateTime
            : orderRandomTime
        break
    }
    const selectedNodes = getSelectedTextNodes()
    const dates = supplierFunction(selectedNodes.length, options)
    supplyData(selectedNodes, orderFunction(dates, dateTimeFormats[format]))

    figma.clientStorage.setAsync('datetime.order', options.order)
    figma.clientStorage.setAsync('datetime.range', options.range)
  }

  on<DateHandler>('HHMM', options => {
    supplyDatetime(getTimeArray, 'HhMm', options)
  })
  on<DateHandler>('HHMMSS', options => {
    supplyDatetime(getTimeArray, 'HhMmSs', options)
  })
  on<DateHandler>('DDMMYY', options => {
    supplyDatetime(getDateTimeArray, 'DdMmYY', options)
  })
  on<DateHandler>('DDMMYYYY', options => {
    supplyDatetime(getDateTimeArray, 'DdMmYyyy', options)
  })
  on<DateHandler>('DDMMMYYYY', options => {
    supplyDatetime(getDateTimeArray, 'DdMmmYyyy', options)
  })
  on<DateHandler>('DDMMMMYYYY', options => {
    supplyDatetime(getDateTimeArray, 'DdMmmmYyyy', options)
  })
  on<DateHandler>('DDMMMMYYYYDDDD', options => {
    supplyDatetime(getDateTimeArray, 'DdMmmmYyyyDddd', options)
  })
  on<DateHandler>('DDMMYYHHMM', options => {
    supplyDatetime(getDateTimeArray, 'DdMmYyHhMm', options)
  })
  on<DateHandler>('DDMMYYYYHHMM', options => {
    supplyDatetime(getDateTimeArray, 'DdMmYyyyHhMm', options)
  })
  on<DateHandler>('DDMMMMYYYYDDDDHHMM', options => {
    supplyDatetime(getDateTimeArray, 'DdMmmmYyyyDdddHhMm', options)
  })
  showUI(
    {
      width: 240,
      height: 600,
    },
    lastOptions
  )
}

function getDateTimeArray(arrayLength: number, options: PluginOptions): Date[] {
  let start = new Date(Date.parse(options.start))
  let end = start
  let modifier = options.order == 'ascending' ? 1 : -1
  //start = Date.parse(optionStart)
  //let end = new Date(new Date().setFullYear(start.getFullYear() - 2))
  switch (options.range) {
    case 'hour':
      end = new Date(new Date().setHours(start.getHours() - 1 * modifier))
      break
    case 'day':
      end = new Date(Number(start) - 24 * 60 * 60 * 1000 * modifier)
      break
    case 'month':
      end = new Date(new Date().setMonth(start.getMonth() - 1 * modifier))
      break
    default:
      end = new Date(new Date().setFullYear(start.getFullYear() - 1 * modifier))
      break
  }
  let range =
    options.order == 'ascending'
      ? start.getTime() - end.getTime()
      : end.getTime() - start.getTime()
  let dates: Date[] = []
  let i = 0
  while (i < arrayLength) {
    dates.push(new Date(start.getTime() + Math.random() * range * modifier))
    i++
  }
  return dates
}

function getTimeArray(arrayLength: number, options: PluginOptions) {
  let start = new Date(Date.parse(options.start))
  let end = start
  let modifier = options.order == 'ascending' ? 1 : -1
  //start = Date.parse(optionStart)
  //let end = new Date(new Date().setFullYear(start.getFullYear() - 2))
  switch (options.range) {
    case 'hour':
      end = new Date(new Date().setHours(start.getHours() - 1 * modifier))
      break
    case 'day':
      end = new Date(Number(start) - 24 * 60 * 60 * 1000 * modifier)
      break
    case 'month':
      end = new Date(new Date().setMonth(start.getMonth() - 1 * modifier))
      break
    default:
      end = new Date(new Date().setFullYear(start.getFullYear() - 1 * modifier))
      break
  }
  let range =
    options.order == 'ascending'
      ? start.getTime() - end.getTime()
      : end.getTime() - start.getTime()
  let times = []
  let i = 0
  while (i < arrayLength) {
    times.push(new Date(start.getTime() + Math.random() * range * modifier))
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
