import {
  getSelectedTextNodes,
  orderAscendingdDateTime,
  orderDescendingDateTime,
  orderRandomDateTime,
  dateTimeFormats,
  supplyData,
  formatDate,
  formatTime,
} from '../utils'

import {
  on,
  showUI,
  setRelaunchButton,
  EventHandler,
} from '@create-figma-plugin/utilities'

export interface PluginOptions {
  order: string
  start: string
  end: string
}

export interface DateHandler extends EventHandler {
  name:
    | 'HHMMOS'
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

export type DateFormat =
  | 'HhMmOs'
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

export default async function (): Promise<void> {
  setRelaunchButton(figma.currentPage, 'turkishDateTime')
  let lastOptions = {
    order: await figma.clientStorage.getAsync('datetime.order'),
    start: await figma.clientStorage.getAsync('datetime.start'),
    end: await figma.clientStorage.getAsync('datetime.end'),
  }

  function supplyDatetime(
    supplierFunction: Function,
    format: DateFormat,
    options: PluginOptions
  ) {
    let orderFunction: Function
    switch (options.order) {
      case 'ascending':
        orderFunction = orderAscendingdDateTime
        break
      case 'descending':
        orderFunction = orderDescendingDateTime
        break
      default:
        orderFunction = orderRandomDateTime
        break
    }

    let formatFunction = ['HhMmOs', 'HhMm', 'HhMmSs'].includes(format)
      ? formatTime
      : formatDate
    const selectedNodes = getSelectedTextNodes()
    const dates = supplierFunction(selectedNodes.length, options)
    const data = orderFunction(dates).map((date: Date) =>
      formatFunction(date, dateTimeFormats[format])
    )
    supplyData(selectedNodes, data)

    figma.clientStorage.setAsync('datetime.order', options.order)
    figma.clientStorage.setAsync('datetime.start', options.start)
    figma.clientStorage.setAsync('datetime.end', options.end)
  }

  on<DateHandler>('HHMMOS', options => {
    supplyDatetime(getDateTimeArray, 'HhMmOs', options)
  })
  on<DateHandler>('HHMM', options => {
    supplyDatetime(getDateTimeArray, 'HhMm', options)
  })
  on<DateHandler>('HHMMSS', options => {
    supplyDatetime(getDateTimeArray, 'HhMmSs', options)
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
      width: 480,
      height: 560,
    },
    lastOptions
  )
}

function getDateTimeArray(arrayLength: number, options: PluginOptions): Date[] {
  let start = new Date(Date.parse(options.start))
  let end = new Date(Date.parse(options.end))
  let dates: Date[] = []
  let i = 0
  while (i < arrayLength) {
    dates.push(
      new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
      )
    )
    i++
  }
  return dates
}
