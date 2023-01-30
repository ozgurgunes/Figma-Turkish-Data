import {
  on,
  showUI,
  setRelaunchButton, EventHandler, traverseNode
} from "@create-figma-plugin/utilities";
import { orderAscendingData, orderDescendingData, orderRandomData, getSelectedTextNodes } from '../utils'

import industries from '../turkishData/businessIndustry'
import occupations from '../turkishData/businessOccupation'
import titles from '../turkishData/businessTitle'
import works from '../turkishData/businessWork'

/* 
    Business Title', 'BusinessTitle')
    Company Name', 'CompanyName')
    Industry Title', 'IndustryTitle')
    Occupation', 'Occupation')
    Shop Name', 'ShopName')
*/

export interface Options {
  order: string
}

export interface NameHandler extends EventHandler {
  name: 
  | 'BUSINESS_TITLE'
  | 'COMPANY_NAME'
  | 'INDUSTRY_TITLE'
  | 'OCCUPATION'
  | 'SHOP_NAME'
  handler: (options: Options) => void;
}

export default async function (): Promise<void> {
  setRelaunchButton(figma.currentPage, 'turkishBusiness')
  const lastOrder = await figma.clientStorage.getAsync('business.lastOrder')
  on<NameHandler>('BUSINESS_TITLE', options => {
    supplyBusinesss(supplyCompanyName, options)
  })
  on<NameHandler>('COMPANY_NAME', options => {
    supplyBusinesss(supplyCompanyName, options)
  })
  on<NameHandler>('INDUSTRY_TITLE', options => {
    supplyBusinesss(supplyIndustryTitle, options)
  })
  on<NameHandler>('OCCUPATION', options => {
    supplyBusinesss(supplyOccupation, options)
  })
  on<NameHandler>('SHOP_NAME', options => {
    supplyBusinesss(supplyShopName, options)
  })
  showUI(
    {
      width: 240,
      height: 368,
    },
    { lastOrder: lastOrder }
  )
}

async function supplyBusinesss(supplierFunction: Function, options: Options) {
  let orderFunction: Function = orderRandomData
  switch (options.order) {
    case 'ascending':
      orderFunction = orderAscendingData
      break
    case 'descending':
      orderFunction = orderDescendingData
      break
    default:
      break
  }
  const selectedNodes = getSelectedTextNodes()
  const locations = orderFunction(
    supplierFunction(selectedNodes.length, options.order)
    )
  selectedNodes.forEach((textNode, i) => {
    figma.loadFontAsync(textNode.fontName as FontName).then(() => {
      textNode.characters = locations[i]
    })
  })
  figma.clientStorage.setAsync('business.lastOrder', options.order)
}

function getCompanies() {
  return titles.map(() => {
    return (
      titles[Math.floor(Math.random() * titles.length)] +
      ' ' +
      industries[Math.floor(Math.random() * industries.length)]
    )
  })
}

function getShops() {
  return titles.map(() => {
    return (
      titles[Math.floor(Math.random() * titles.length)] +
      ' ' +
      works[Math.floor(Math.random() * works.length)]
    )
  })
}

export function supplyIndustryTitle() {
  return industries
}

export function supplyBusinessTitle() {
  return works
}

export function supplyCompanyName() {
  return getCompanies()
}

export function supplyOccupation() {
  return occupations
}

export function supplyShopName() {
  return getShops()
}
