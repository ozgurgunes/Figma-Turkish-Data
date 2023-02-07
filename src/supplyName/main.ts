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
} from '../utils'

import maleNames from '../turkishData/nameMale'
import femaleNames from '../turkishData/nameFemale'
import lastNames from '../turkishData/nameLast'

export interface Options {
  order: string
  gender: string
}

export interface NameHandler extends EventHandler {
  name: 'FULL_NAME' | 'FIRST_NAME' | 'LAST_NAME' | 'FIRST_L' | 'LAST_FIRST'
  handler: (options: Options) => void
}

export default async function (): Promise<void> {
  setRelaunchButton(figma.currentPage, 'turkishName')
  const lastOrder = await figma.clientStorage.getAsync("name.lastOrder")
  const lastGender = await figma.clientStorage.getAsync("name.lastGender")
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
    {lastOrder: lastOrder, lastGender: lastGender}
  )
}

async function supplyNames(supplierFunction: Function, options: Options) {
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
  const names = orderFunction(
    supplierFunction(selectedNodes.length, options.gender)
  )
  selectedNodes.forEach((textNode, i) => {
    figma.loadFontAsync(textNode.fontName as FontName).then(() => {
      textNode.characters = names[i]
    })
  })
  figma.clientStorage.setAsync("name.lastOrder", options.order);
  figma.clientStorage.setAsync("name.lastGender", options.gender);
}

function getFullNames(length: number, gender?: string) {
  const getNames = (namesArray: string[], length: number) => {
    let names: string[] = []
    for (let i = 0; i < length; i++) {
      names.push(namesArray[Math.floor(Math.random() * namesArray.length)])
    }
    return names.map(n => {
      return n + ' ' + lastNames[Math.floor(Math.random() * lastNames.length)]
    })
  }
  switch (gender) {
    case 'female':
      return getNames(femaleNames, length)
    case 'male':
      return getNames(maleNames, length)
    default:
      return getNames(femaleNames.concat(maleNames), length)
  }
}

function getFirstNames(length: number, gender?: string) {
  const getNames = (namesArray: string[], length: number) => {
    let names: string[] = []
    for (let i = 0; i < length; i++) {
      names.push(namesArray[Math.floor(Math.random() * namesArray.length)])
    }
    return names
  }
  switch (gender) {
    case 'female':
      return getNames(femaleNames, length)
    case 'male':
      return getNames(maleNames, length)
    default:
      return getNames(femaleNames.concat(maleNames), length)
  }
}

function getLastNames(length: number, gender?: string) {
    let names: string[] = []
    for (let i = 0; i < length; i++) {
      names.push(lastNames[Math.floor(Math.random() * lastNames.length)])
    }
    return names
  }

function getFirstLs(length: number, gender?: string) {
  const getNames = (namesArray: string[], length: number) => {
    let names: string[] = []
    for (let i = 0; i < length; i++) {
      names.push(namesArray[Math.floor(Math.random() * namesArray.length)])
    }
    return names.map(n => {
      return n + ' ' + lastNames[Math.floor(Math.random() * lastNames.length)][0] + '.'
    })
  }
  switch (gender) {
    case 'female':
      return getNames(femaleNames, length)
    case 'male':
      return getNames(maleNames, length)
    default:
      return getNames(femaleNames.concat(maleNames), length)
  }
}

function getLastFirsts(length: number, gender?: string) {
  const getNames = (namesArray: string[], length: number) => {
    let names: string[] = []
    for (let i = 0; i < length; i++) {
      names.push(namesArray[Math.floor(Math.random() * namesArray.length)])
    }
    return names.map(n => {
      return n + ', ' + lastNames[Math.floor(Math.random() * lastNames.length)]
    })
  }
  switch (gender) {
    case 'female':
      return getNames(femaleNames, length)
    case 'male':
      return getNames(maleNames, length)
    default:
      return getNames(femaleNames.concat(maleNames), length)
  }
}