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
} from '../utils'

export interface Options {
  order: string
  symbol: string
  decimal: string
  min: string
  max: string
  total: string
}

export interface NameHandler extends EventHandler {
  name: 'PRICE' | 'SEQUENCE' | 'TOTAL'
  handler: (options: Options) => void
}

export default async function (): Promise<void> {
  setRelaunchButton(figma.currentPage, 'turkishPrice')
  const lastOrder = await figma.clientStorage.getAsync('price.lastOrder')
  const lastSymbol = await figma.clientStorage.getAsync('price.lastSymbol')
  const lastDecimal = await figma.clientStorage.getAsync('price.lastDecimal')
  const lastMin = await figma.clientStorage.getAsync('price.lastMin')
  const lastMax = await figma.clientStorage.getAsync('price.lastMax')
  on<NameHandler>('PRICE', function (options) {
    console.log(globalThis)
    supplyPrices(getPrices, options)
    saveOptions(options)
  })
  on<NameHandler>('SEQUENCE', function (options) {
    supplySequence(getSequence, options)
    saveOptions(options)
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
    {
      lastOrder: lastOrder,
      lastSymbol: lastSymbol,
      lastDecimal: lastDecimal,
      lastMin: lastMin,
      lastMax: lastMax,
      total: String(getTotal()),
    }
  )
}

async function saveOptions(options: Options) {
  figma.clientStorage.setAsync('price.lastOrder', options.order)
  figma.clientStorage.setAsync('price.lastSymbol', options.symbol)
  figma.clientStorage.setAsync('price.lastDecimal', options.decimal)
  figma.clientStorage.setAsync('price.lastMin', options.min)
  figma.clientStorage.setAsync('price.lastMax', options.max)
}

async function supplyPrices(supplierFunction: Function, options: Options) {
  let orderFunction: Function = orderRandomString
  switch (options.order) {
    case 'ascending':
      orderFunction = orderAscendingString
      break
    case 'descending':
      orderFunction = orderDescendingString
      break
    default:
      break
  }
  const selectedNodes = getSelectedTextNodes()
  const prices = orderFunction(supplierFunction(selectedNodes.length, options))
  selectedNodes.forEach((textNode, i) => {
    figma.loadFontAsync(textNode.fontName as FontName).then(() => {
      textNode.characters = prices[i]
    })
  })
}

async function supplySequence(supplierFunction: Function, options: Options) {
  let orderFunction: Function = orderRandomString
  const selectedNodes = getSelectedTextNodes()
  const squence = orderFunction(supplierFunction(selectedNodes.length, options))
  switch (options.order) {
    case 'ascending':
      squence.sort((a: number, b: number) => (a > b ? 1 : -1))
      break
    case 'descending':
      squence.sort((a: number, b: number) => (a < b ? 1 : -1))
      break
    default:
      shuffle(squence)
      break
  }

  selectedNodes.forEach((textNode, i) => {
    figma.loadFontAsync(textNode.fontName as FontName).then(() => {
      textNode.characters = String(squence[i])
    })
  })
}

function getPrices(length: number, options: Options) {
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
      case 'max':
        price = price + 0.99
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

function getSequence(length: number, options: Options) {
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
      node.characters.replace(/\./g, '').replace(/\,/g, '.').replace(/\₺/g, '')
    )
  )
  return (arr.length ? arr.reduce((sum, i) => sum + i) : 0).toLocaleString(
    'tr',
    { minimumFractionDigits: 2 }
  )
}
