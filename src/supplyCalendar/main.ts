import {
  orderAscendingTime,
  orderAscendingdDateTime,
  orderRandomDateTime,
  orderRandomTime,
  getSelectedTextNodes,
  calendarFormats,
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

type CalendarFormat =
  | 'DayName'
  | 'DayNumber'
  | 'MonthName'
  | 'MonthNumber'
  | 'DayAndMonthName'
  | 'MonthNameAndYear'

export interface PluginOptions {
  order: string
  start: string
}

export interface DateHandler extends EventHandler {
  name:
    | 'DAY_NUMBER'
    | 'DAY_NAME'
    | 'MONTH_NUMBER'
    | 'MONTH_NAME'
    | 'DAY_AND_MONTH_NAME'
    | 'MONTH_NAME_AND_YEAR'

  handler: (options: PluginOptions) => void
}

export default async function (): Promise<void> {
  setRelaunchButton(figma.currentPage, 'turkishDateTime')
  let lastOptions = {
    order: await figma.clientStorage.getAsync('datetime.order'),
    range: await figma.clientStorage.getAsync('datetime.range'),
  }

  function supplyDatetime(
    supplierFunction: Function,
    format: CalendarFormat,
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
    
    const selectedNodes = getSelectedTextNodes()
    const dates = supplierFunction(selectedNodes.length, options)
    supplyData(selectedNodes, orderFunction(dates, calendarFormats[format]))

    figma.clientStorage.setAsync('datetime.order', options.order)
    figma.clientStorage.setAsync('datetime.start', options.start)
  }

  on<DateHandler>('DAY_NAME', options => {
    supplyDatetime(getDays, 'DayName', options)
  })
  on<DateHandler>('DAY_NUMBER', options => {
    supplyDatetime(getDays, 'DayNumber', options)
  })
  on<DateHandler>('MONTH_NAME', options => {
    supplyDatetime(getMonths, 'MonthName', options)
  })
  on<DateHandler>('MONTH_NUMBER', options => {
    supplyDatetime(getMonths, 'MonthNumber', options)
  })
  on<DateHandler>('DAY_AND_MONTH_NAME', options => {
    supplyDatetime(getDays, 'DayAndMonthName', options)
  })
  on<DateHandler>('MONTH_NAME_AND_YEAR', options => {
    supplyDatetime(getMonths, 'MonthNameAndYear', options)
  })

  showUI(
    {
      width: 240,
      height: 600,
    },
    lastOptions
  )
}

function getDays(length: number, options: PluginOptions) {
  let start = new Date(Date.parse(options.start))
  let modifier = -1 //options.order == 'ascending' ? 1 : -1
  let days = []
  for (let i = 0; i < length; i++) {
    days.push(new Date(Number(start) - i * 24 * 60 * 60 * 1000 * modifier))
  }
  return days
}

function getMonths(length: number, options: PluginOptions) {
  let start = new Date(Date.parse(options.start))
  let modifier = +1 //options.order == 'ascending' ? 1 : -1
  let days = []
  for (let i = 0; i < length; i++) {
    days.push(new Date(new Date().setMonth(start.getMonth() + 1 * modifier * i)))
  }
  return days
}
