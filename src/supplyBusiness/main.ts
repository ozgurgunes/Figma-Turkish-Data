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

import industries from '../turkishData/businessIndustry'
import occupations from '../turkishData/businessOccupation'
import titles from '../turkishData/businessTitle'
import works from '../turkishData/businessWork'

export interface PluginOptions {
  order: string
}

export interface NameHandler extends EventHandler {
  name:
    | 'BUSINESS_TITLE'
    | 'COMPANY_NAME'
    | 'INDUSTRY_TITLE'
    | 'OCCUPATION'
    | 'SHOP_NAME'
  handler: (options: PluginOptions) => void
}

export default async function (): Promise<void> {
  setRelaunchButton(figma.currentPage, 'turkishBusiness')
  const lastOptions = {
    order: await figma.clientStorage.getAsync('business.order'),
  }

  function supplyBusinesss(supplierFunction: Function, options: PluginOptions) {
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
    const locations = supplierFunction(selectedNodes.length, options.order)
    supplyData(selectedNodes, orderFunction(locations))

    figma.clientStorage.setAsync('business.order', options.order)
  }

  on<NameHandler>('BUSINESS_TITLE', options => {
    supplyBusinesss(getCompanyNames, options)
  })
  on<NameHandler>('COMPANY_NAME', options => {
    supplyBusinesss(getCompanyNames, options)
  })
  on<NameHandler>('INDUSTRY_TITLE', options => {
    supplyBusinesss(getIndustryTitles, options)
  })
  on<NameHandler>('OCCUPATION', options => {
    supplyBusinesss(getOccupations, options)
  })
  on<NameHandler>('SHOP_NAME', options => {
    supplyBusinesss(getShopNames, options)
  })
  showUI(
    {
      width: 240,
      height: 288,
    },
    lastOptions
  )
}

export function getIndustryTitles() {
  return industries
}

export function getBusinessTitles() {
  return works
}

export function getCompanyNames() {
  return titles.map(() => {
    return (
      titles[Math.floor(Math.random() * titles.length)] +
      ' ' +
      industries[Math.floor(Math.random() * industries.length)]
    )
  })
}

export function getOccupations() {
  return occupations
}

export function getShopNames() {
  return titles.map(() => {
    return (
      titles[Math.floor(Math.random() * titles.length)] +
      ' ' +
      works[Math.floor(Math.random() * works.length)]
    )
  })
}
