import {
  getSelectedTextNodes,
  orderRandomString,
  orderAscendingString,
  orderDescendingString,
  supplyData,
} from '../utils'

import {
  on,
  showUI,
  setRelaunchButton,
  EventHandler,
} from '@create-figma-plugin/utilities'

export interface PluginOptions {
  order: string
  country: string
  area: string
}

export interface PhoneFunctions {
  country: Function
  area: Function
  number: Function
}

export interface PhoneHandler extends EventHandler {
  name:
    | 'PLUS_COUNTRY_PARENTHESIS'
    | 'PLUS_COUNTRY_SIMPLE'
    | 'COUNTRY_PARENTHESIS'
    | 'COUNTRY_SIMPLE'
    | 'AREA_PARENTHESIS'
    | 'AREA_SIMPLE'
    | 'PLUS_COUNTRY_COMBINED'
    | 'COUNTRY_COMBINED'
    | 'AREA_COMBINED'

  handler: (options: PluginOptions) => void
}

export default async function (): Promise<void> {
  setRelaunchButton(figma.currentPage, 'turkishPhone')
  let lastOptions = {
    order: await figma.clientStorage.getAsync('phone.order'),
    country: await figma.clientStorage.getAsync('phone.country'),
    area: await figma.clientStorage.getAsync('phone.area'),
  }

  function supplyPhones(phoneArrayFunction: Function, options: PluginOptions) {
    let selectedNodes = getSelectedTextNodes()
    let phoneFunctions = {
      country: () =>
        options.country
          ? options.country
          : Math.floor(Math.random() * (99 - 1) + 1),
      area: () =>
        options.area
          ? options.area
          : Math.floor(Math.random() * (599 - 500) + 500),
      number: () => Math.floor(Math.random() * (9999999 - 1000000) + 1000000),
    }

    let phones = phoneArrayFunction(selectedNodes.length, phoneFunctions)
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

    supplyData(selectedNodes, orderFunction(phones))

    figma.clientStorage.setAsync('phone.order', options.order)
    figma.clientStorage.setAsync('phone.country', options.country)
    figma.clientStorage.setAsync('phone.area', options.area)
  }

  on<PhoneHandler>('PLUS_COUNTRY_PARENTHESIS', options => {
    supplyPhones(getPlusCountryParenthesisPhones, options)
  })
  on<PhoneHandler>('PLUS_COUNTRY_SIMPLE', options => {
    supplyPhones(getPlusCountrySimplePhones, options)
  })
  on<PhoneHandler>('COUNTRY_PARENTHESIS', options => {
    supplyPhones(getCountryParenthesisPhones, options)
  })
  on<PhoneHandler>('COUNTRY_SIMPLE', options => {
    supplyPhones(getCountrySimplePhones, options)
  })
  on<PhoneHandler>('AREA_PARENTHESIS', options => {
    supplyPhones(getAreaParenthesisPhones, options)
  })
  on<PhoneHandler>('AREA_SIMPLE', options => {
    supplyPhones(getAreaSimplePhones, options)
  })
  on<PhoneHandler>('PLUS_COUNTRY_COMBINED', options => {
    supplyPhones(getPlusCountryCombinedPhones, options)
  })
  on<PhoneHandler>('COUNTRY_COMBINED', options => {
    supplyPhones(getCountryCombinedPhones, options)
  })
  on<PhoneHandler>('AREA_COMBINED', options => {
    supplyPhones(getAreaCombinedPhones, options)
  })
  showUI(
    {
      width: 240,
      height: 520,
    },
    lastOptions
  )
}

function getPlusCountryParenthesisPhones(length: number, phone: PhoneFunctions) {
  let phones: string[] = []
  for (let i = 0; i < length; i++) {
    phones.push(`+${phone.country()} (${phone.area()}) ${phone.number()}`)
  }
  return phones
}

function getPlusCountrySimplePhones(length: number, phone: PhoneFunctions) {
  let phones: string[] = []
  for (let i = 0; i < length; i++) {
    phones.push(`+${phone.country()} ${phone.area()} ${phone.number()}`)
  }
  return phones
}
function getCountryParenthesisPhones(length: number, phone: PhoneFunctions) {
  let phones: string[] = []
  for (let i = 0; i < length; i++) {
    phones.push(`${phone.country()} (${phone.area()}) ${phone.number()}`)
  }
  return phones
}

function getCountrySimplePhones(length: number, phone: PhoneFunctions) {
  let phones: string[] = []
  for (let i = 0; i < length; i++) {
    phones.push(`${phone.country()} ${phone.area()} ${phone.number()}`)
  }
  return phones
}

function getAreaParenthesisPhones(length: number, phone: PhoneFunctions) {
  let phones: string[] = []
  for (let i = 0; i < length; i++) {
    phones.push(`(${phone.area()}) ${phone.number()}`)
  }
  return phones
}

function getAreaSimplePhones(length: number, phone: PhoneFunctions) {
  let phones: string[] = []
  for (let i = 0; i < length; i++) {
    phones.push(`${phone.area()} ${phone.number()}`)
  }
  return phones
}

function getPlusCountryCombinedPhones(length: number, phone: PhoneFunctions) {
  let phones: string[] = []
  for (let i = 0; i < length; i++) {
    phones.push(`+${phone.country()}${phone.area()}${phone.number()}`)
  }
  return phones
}

function getCountryCombinedPhones(length: number, phone: PhoneFunctions) {
  let phones: string[] = []
  for (let i = 0; i < length; i++) {
    phones.push(`${phone.country()}${phone.area()}${phone.number()}`)
  }
  return phones
}

function getAreaCombinedPhones(length: number, phone: PhoneFunctions) {
  let phones: string[] = []
  for (let i = 0; i < length; i++) {
    phones.push(`${phone.area()}${phone.number()}`)
  }
  return phones
}
