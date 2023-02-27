import {
  on,
  showUI,
  setRelaunchButton,
  EventHandler,
} from '@create-figma-plugin/utilities'
import {
  orderAscendingString,
  orderDescendingString,
  orderRandomString,
  getSelectedTextNodes,
  shuffle,
  supplyData,
} from '../utils'

export interface PluginOptions {
  order: string
  symbol: string
  decimal: string
  min: string
  max: string
  total: string
}

export interface NameHandler extends EventHandler {
  name: 'PRICE' | 'SEQUENCE' | 'TOTAL'
  handler: (options: PluginOptions) => void
}

export default async function (): Promise<void> {
  setRelaunchButton(figma.currentPage, 'turkishPrice')
  let lastOptions = {
    order: await figma.clientStorage.getAsync('price.order'),
    symbol: await figma.clientStorage.getAsync('price.symbol'),
    decimal: await figma.clientStorage.getAsync('price.decimal'),
    min: await figma.clientStorage.getAsync('price.min'),
    max: await figma.clientStorage.getAsync('price.max'),
    total: String(getTotal()),
  }

  function saveOptions(options: PluginOptions) {
    figma.clientStorage.setAsync('price.order', options.order)
    figma.clientStorage.setAsync('price.symbol', options.symbol)
    figma.clientStorage.setAsync('price.decimal', options.decimal)
    figma.clientStorage.setAsync('price.min', options.min)
    figma.clientStorage.setAsync('price.max', options.max)
  }

  function supplyPrices(supplierFunction: Function, options: PluginOptions) {
    let orderFunction: Function
    switch (options.order) {
      case 'ascending':
        orderFunction = orderAscendingString
        break
      case 'descending':
        orderFunction = orderDescendingString
        break
      default:
        orderFunction = orderRandomString
        break
    }
    const selectedNodes = getSelectedTextNodes()
    const prices = supplierFunction(selectedNodes.length, options)
    supplyData(selectedNodes, orderFunction(prices))
    saveOptions(options)
  }

  function supplySequence(supplierFunction: Function, options: PluginOptions) {
    let orderFunction: Function
    switch (options.order) {
      case 'ascending':
        orderFunction = (arr: number[]) =>
          arr.sort((a: number, b: number) => (a > b ? 1 : -1))
        break
      case 'descending':
        orderFunction = (arr: number[]) =>
          arr.sort((a: number, b: number) => (a < b ? 1 : -1))
        break
      default:
        orderFunction = shuffle
        break
    }
    const selectedNodes = getSelectedTextNodes()
    const squence = orderFunction(
      supplierFunction(selectedNodes.length, options)
    )
    supplyData(selectedNodes, orderFunction(squence))
    saveOptions(options)
  }

  on<NameHandler>('PRICE', function (options) {
    supplyPrices(getPrices, options)
  })
  on<NameHandler>('SEQUENCE', function (options) {
    supplySequence(getSequence, options)
  })

  figma.on('selectionchange', function () {
    figma.ui.postMessage({ newTotal: getTotal() })
  })
  figma.on('documentchange', function () {
    figma.ui.postMessage({ newTotal: getTotal() })
  })

  showUI(
    {
      width: 240,
      height: 408,
    },
    lastOptions
  )
}

function getPrices(length: number, options: PluginOptions) {
  let prices: string[] = []
  let fractions = {}
  for (let i = 0; i < length; i++) {
    let price = Math.floor(
      Math.random() * (parseInt(options.max) - parseInt(options.min)) +
        parseInt(options.min)
    )
    switch (options.decimal) {
      case 'random':
        price = price + Math.floor(Math.random() * (100 - 10) + 10) / 100
        break
      case 'max':
        price = price + 0.99
        break
      case 'min':
        fractions = { minimumFractionDigits: 2 }
      default:
        break
    }

    let priceString = price.toLocaleString('tr', fractions)
    switch (options.symbol) {
      case 'sign':
        priceString = '₺' + priceString
        break
      case 'tl':
        priceString = priceString + ' TL'
        break
      case 'try':
        priceString = priceString + ' TRY'
        break
      default:
        break
    }
    prices.push(priceString)
  }
  return prices
}

function getSequence(length: number, options: PluginOptions) {
  let squence: number[] = []
  for (let i = 0; i < length; i++) {
    squence.push(parseInt(options.min) + i)
  }
  return squence
}

function getTotal() {
  const selectedNodes = getSelectedTextNodes()
  let arr = selectedNodes.map(node =>
    parseFloat(
      node.characters.replace(/₺/g, '').replace(/\./g, '').replace(/,/g, '.')
    )
  )
  return (arr.length ? arr.reduce((sum, i) => sum + i) : 0).toLocaleString(
    'tr',
    { minimumFractionDigits: 2 }
  )
}
