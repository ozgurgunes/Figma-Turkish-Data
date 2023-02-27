import {
  getSelectedTextNodes,
  orderAscendingNumber,
  orderDescendingNumber,
  orderRandomNumber,
  supplyData,
  turkishDuration
} from '../utils'

import {
  on,
  showUI,
  setRelaunchButton,
  EventHandler,
} from '@create-figma-plugin/utilities'

export interface PluginOptions {
  order: string
  min_value: string
  min_unit: string
  max_value: string
  max_unit: string
}

export interface DateHandler extends EventHandler {
  name:
    | 'BASIC'
    | 'SHORT'
  handler: (options: PluginOptions) => void
}

export default async function (): Promise<void> {
  setRelaunchButton(figma.currentPage, 'turkishDuration')
  // Get last used options.
  let lastOptions = {
    order: await figma.clientStorage.getAsync('duration.order'),
    min_value: await figma.clientStorage.getAsync('duration.min_value'),
    min_unit: await figma.clientStorage.getAsync('duration.min_unit'),
    max_value: await figma.clientStorage.getAsync('duration.max_value'),
    max_unit: await figma.clientStorage.getAsync('duration.max_unit'),
  }

  on<DateHandler>('BASIC', options => {
    supplyDuration(getDurationArray, turkishDuration.basic, options)
  })
  on<DateHandler>('SHORT', options => {
    supplyDuration(getDurationArray, turkishDuration.short, options)
  })

  showUI(
    {
      width: 240,
      height: 240,
    },
    lastOptions
  )

  function supplyDuration(
    supplierFunction: Function,
    formatFunction: Function,
    options: PluginOptions
  ) {
    let orderFunction: Function
    switch (options.order) {
      case 'ascending':
        orderFunction = orderAscendingNumber
        break
      case 'descending':
        orderFunction = orderDescendingNumber
        break
      default:
        orderFunction = orderRandomNumber
        break
    }
    const selectedNodes = getSelectedTextNodes()
    const dates = supplierFunction(selectedNodes.length, options)
    const data = orderFunction(dates).map((date: number) =>
      formatFunction(date)
    )
    supplyData(selectedNodes, data)

    figma.clientStorage.setAsync('duration.order', options.order)
    figma.clientStorage.setAsync('duration.min_value', options.min_value)
    figma.clientStorage.setAsync('duration.min_unit', options.min_unit)
    figma.clientStorage.setAsync('duration.max_value', options.max_value)
    figma.clientStorage.setAsync('duration.max_unit', options.max_unit)
  }

}

function getDurationArray(
  arrayLength: number,
  options: PluginOptions
): Number[] {
  let min = Number(options.min_value) * Number(options.min_unit)
  let max = Number(options.max_value) * Number(options.max_unit)
  console.log(new Date())
  let dates = []
  let i = 0
  while (i < arrayLength) {
    dates.push(Math.floor(Math.random() * (max - min) + min))
    i++
  }
  return dates
}
