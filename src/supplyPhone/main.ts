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

export interface Options {
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

  handler: (options: Options) => void
}

export default async function (): Promise<void> {
  setRelaunchButton(figma.currentPage, 'turkishPhone')
  let options = await getOptions()  

  on<PhoneHandler>('PLUS_COUNTRY_PARENTHESIS', options => {
    supplyPhones(getPlusCountryParenthesisPhones, options)
    saveOptions(options)
  })
  on<PhoneHandler>('PLUS_COUNTRY_SIMPLE', options => {
    supplyPhones(getPlusCountrySimplePhones, options)
    saveOptions(options)
  })
  on<PhoneHandler>('COUNTRY_PARENTHESIS', options => {
    supplyPhones(getCountryParenthesisPhones, options)
    saveOptions(options)
  })
  on<PhoneHandler>('COUNTRY_SIMPLE', options => {
    supplyPhones(getCountrySimplePhones, options)
    saveOptions(options)
  })
  on<PhoneHandler>('AREA_PARENTHESIS', options => {
    supplyPhones(getAreaParenthesisPhones, options)
    saveOptions(options)
  })
  on<PhoneHandler>('AREA_SIMPLE', options => {
    supplyPhones(getAreaSimplePhones, options)
    saveOptions(options)
  })
  on<PhoneHandler>('PLUS_COUNTRY_COMBINED', options => {
    supplyPhones(getPlusCountryCombinedPhones, options)
    saveOptions(options)
  })
  on<PhoneHandler>('COUNTRY_COMBINED', options => {
    supplyPhones(getCountryCombinedPhones, options)
    saveOptions(options)
  })
  on<PhoneHandler>('AREA_COMBINED', options => {
    supplyPhones(getAreaCombinedPhones, options)
    saveOptions(options)
  })
  showUI(
    {
      width: 240,
      height: 520,
    },
    { lastOrder: options.lastOrder, lastCountry: options.lastCountry, lastArea: options.lastArea }
  )
}

async function getOptions () {
  return {
    lastOrder: await figma.clientStorage.getAsync('phone.lastOrder'),
    lastCountry: await figma.clientStorage.getAsync('phone.lastCountry'),
    lastArea: await figma.clientStorage.getAsync('phone.lastArea')
  }
}

async function saveOptions(options:Options) {
  figma.clientStorage.setAsync('phone.lastOrder', options.order)
  figma.clientStorage.setAsync('phone.lastCountry', options.country)
  figma.clientStorage.setAsync('phone.lastArea', options.area)
}


async function supplyPhones(phoneFormatFunction: Function, options: Options) {
  let selectedNodes = getSelectedTextNodes()
  let phoneFunctions = {
    country: () => options.country ? options.country : Math.floor(Math.random() * (99 - 1) + 1),
    area: () => options.area ? options.area : Math.floor(Math.random() * (599 - 500) + 500),
    number: () => Math.floor(Math.random() * (9999999 - 1000000) + 1000000)
  }
  let phones: string[] = []
  for (let i = 0; i < selectedNodes.length; i++) {
    phones.push(phoneFormatFunction(phoneFunctions))
  }

  await supplyData(selectedNodes, phones)
}

function getPlusCountryParenthesisPhones(phone: PhoneFunctions) {
  return `+${phone.country()} (${phone.area()}) ${phone.number()}`
}

function getPlusCountrySimplePhones(phone: PhoneFunctions) {
  return `+${phone.country()} ${phone.area()} ${phone.number()}`
}
function getCountryParenthesisPhones(phone: PhoneFunctions) {
  return `${phone.country()} (${phone.area()}) ${phone.number()}`
}
function getCountrySimplePhones(phone: PhoneFunctions) {
  return `${phone.country()} ${phone.area()} ${phone.number()}`
}
function getAreaParenthesisPhones(phone: PhoneFunctions) {
  return `(${phone.area()}) ${phone.number()}`
}
function getAreaSimplePhones(phone: PhoneFunctions) {
  return `${phone.area()} ${phone.number()}`
}
function getPlusCountryCombinedPhones(phone: PhoneFunctions) {
  return `+${phone.country()}${phone.area()}${phone.number()}`
}
function getCountryCombinedPhones(phone: PhoneFunctions) {
  return `${phone.country()}${phone.area()}${phone.number()}`
}
function getAreaCombinedPhones(phone: PhoneFunctions) {
  return `${phone.area()}${phone.number()}`
}
