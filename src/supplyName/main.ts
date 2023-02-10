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
  supplyData,
} from '../utils'

import maleNames from '../turkishData/nameMale'
import femaleNames from '../turkishData/nameFemale'
import lastNames from '../turkishData/nameLast'

export interface PluginOptions {
  order: string
  gender: string
}

export interface NameHandler extends EventHandler {
  name: 'FULL_NAME' | 'FIRST_NAME' | 'LAST_NAME' | 'FIRST_L' | 'LAST_FIRST'
  handler: (options: PluginOptions) => void
}

export default async function (): Promise<void> {
  setRelaunchButton(figma.currentPage, 'turkishName')
  let lastOptions = {
    order: await figma.clientStorage.getAsync('name.order'),
    gender: await figma.clientStorage.getAsync('name.gender'),
  }

  function supplyNames(supplierFunction: Function, options: PluginOptions) {
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
    const names = supplierFunction(selectedNodes.length, options.gender)
    supplyData(selectedNodes, orderFunction(names))

    figma.clientStorage.setAsync('name.order', options.order)
    figma.clientStorage.setAsync('name.gender', options.gender)
  }

  on<NameHandler>('FULL_NAME', function (options) {
    supplyNames(getFullNames, options)
  })
  on<NameHandler>('FIRST_NAME', function (options) {
    supplyNames(getFirstNames, options)
  })
  on<NameHandler>('LAST_NAME', function (options) {
    supplyNames(getLastNames, options)
  })
  on<NameHandler>('LAST_FIRST', function (options) {
    supplyNames(getLastFirsts, options)
  })
  on<NameHandler>('FIRST_L', function (options) {
    supplyNames(getFirstLs, options)
  })
  showUI(
    {
      width: 240,
      height: 352,
    },
    lastOptions
  )
}

function supplyFirstNames(gender: string) {
  let names = []
  switch (gender) {
    case 'female':
      names = femaleNames
    case 'male':
      names = maleNames
    default:
      names = femaleNames.concat(maleNames)
  }
  return names
}

function getFullNames(length: number, gender: string) {
  let names: string[] = []
  let firstNames = supplyFirstNames(gender)
  for (let i = 0; i < length; i++) {
    names.push(firstNames[Math.floor(Math.random() * firstNames.length)])
  }
  return names.map(n => {
    return n + ' ' + lastNames[Math.floor(Math.random() * lastNames.length)]
  })
}

function getFirstNames(length: number, gender: string) {
  let names: string[] = []
  let firstNames = supplyFirstNames(gender)
  for (let i = 0; i < length; i++) {
    names.push(firstNames[Math.floor(Math.random() * firstNames.length)])
  }
  return names
}

function getLastNames(length: number, gender: string) {
  let names: string[] = []
  for (let i = 0; i < length; i++) {
    names.push(lastNames[Math.floor(Math.random() * lastNames.length)])
  }
  return names
}

function getFirstLs(length: number, gender: string) {
  let names: string[] = []
  let firstNames = supplyFirstNames(gender)
  for (let i = 0; i < length; i++) {
    names.push(firstNames[Math.floor(Math.random() * firstNames.length)])
  }
  return names.map(n => {
    return (
      n + ' ' + lastNames[Math.floor(Math.random() * lastNames.length)][0] + '.'
    )
  })
}

function getLastFirsts(length: number, gender: string) {
  let names: string[] = []
  let firstNames = supplyFirstNames(gender)
  for (let i = 0; i < length; i++) {
    names.push(firstNames[Math.floor(Math.random() * firstNames.length)])
  }
  return names.map(n => {
    return n + ', ' + lastNames[Math.floor(Math.random() * lastNames.length)]
  })
}
