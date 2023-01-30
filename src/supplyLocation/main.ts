import {
  on,
  showUI,
  setRelaunchButton,
  EventHandler,
  traverseNode,
} from '@create-figma-plugin/utilities'
import {
  orderAscendingData,
  orderDescendingData,
  orderRandomData,
  getSelectedTextNodes,
} from '../utils'

import cities from '../turkishData/locationCity'
import countries from '../turkishData/locationCountry'
import addresses from '../turkishData/locationAddress'

/* 
  Address, 'Address'
  City, 'City'
  Country, 'Country'
  District / City, 'DistrictSlashCity'
  District, City, 'DistrictCommaCity'
  Districts of Ankara, 'DistrictsOfAnkara'
  Districts of Istanbul, 'DistrictsOfIstanbul'
*/

export interface Options {
  order: string
}

export interface NameHandler extends EventHandler {
  name:
    | 'ADDRESS'
    | 'CITY'
    | 'COUNTRY'
    | 'DISTRICT_SLASH_CITY'
    | 'DISTRICT_COMMA_CITY'
    | 'DISTRICTS_OF_ANKARA'
    | 'DISTRICTS_OF_ISTANBUL'
  handler: (options: Options) => void
}

export default async function (): Promise<void> {
  setRelaunchButton(figma.currentPage, 'turkishLocation')
  const lastOrder = await figma.clientStorage.getAsync('location.lastOrder')
  on<NameHandler>('ADDRESS', options => {
    supplyLocations(supplyAddress, options)
  })
  on<NameHandler>('CITY', options => {
    supplyLocations(supplyCity, options)
  })
  on<NameHandler>('COUNTRY', options => {
    supplyLocations(supplyCountry, options)
  })
  on<NameHandler>('DISTRICT_SLASH_CITY', options => {
    supplyLocations(supplyDistrictSlashCity, options)
  })
  on<NameHandler>('DISTRICT_COMMA_CITY', options => {
    supplyLocations(supplyDistrictCommaCity, options)
  })
  on<NameHandler>('DISTRICTS_OF_ANKARA', options => {
    supplyLocations(supplyDistrictsOfAnkara, options)
  })
  on<NameHandler>('DISTRICTS_OF_ISTANBUL', options => {
    supplyLocations(supplyDistrictsOfIstanbul, options)
  })
  showUI(
    {
      width: 240,
      height: 368,
    },
    { lastOrder: lastOrder }
  )
}

async function supplyLocations(supplierFunction: Function, options: Options) {
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
  figma.clientStorage.setAsync('location.lastOrder', options.order)
}

function getAddresses(length: number) {
  let data = []
  for (let i = 0; i < length; i++) {
    let address = ''
    let str1 = ['Mah.', 'Cad.', 'Bul.'][Math.floor(Math.random() * 3)]
    let str2 = ['Cad.', 'Sok.', 'Apt.']
    switch (true) {
      case str1 == 'Mah.':
        str2.splice(2, 1)
        break
      case str1 == 'Cad.':
        str2.splice(0, 1)
        break
    }

    address += addresses[Math.floor(Math.random() * addresses.length)]
    address += ' ' + str1
    address += ' ' + addresses[Math.floor(Math.random() * addresses.length)]
    address += ' ' + str2[Math.floor(Math.random() * str2.length)]
    address += ' No: ' + (Math.floor(Math.random() * 100) + 1)
    address +=
      Math.random() >= 0.5 ? '/' + (Math.floor(Math.random() * 25) + 1) : ''
    let city = cities[Math.floor(Math.random() * cities.length)]
    let town = city.towns[Math.floor(Math.random() * city.towns.length)]
    address += ' ' + town + ', ' + city.name
    data.push(address)
  }
  return data
}

export function supplyAddress(length: number, order?: string) {
  return getAddresses(length)
}

export function supplyCity(length: number, order?: string) {
  let data: string[] = []
  console.log('Pass')
  let names = cities.map(city => city.name)
    switch (order) {
      case 'ascending':
        names = orderAscendingData(names)
        for (let i = 0; i < length; i++) {
          data.push(names[i % names.length])
        }
        break
      case 'descending':
        names = orderDescendingData(names)
        for (let i = 0; i < length; i++) {
          data.push(names[i % names.length])
        }
        break
      default:
        for (let i = 0; i < length; i++) {
          data.push(names[Math.floor(Math.random() * names.length)])
        }
        break
    }
  return data
}

export function supplyDistrictCommaCity(length: number, order?: string) {
  let data: any[] = []
  for (let i = 0; i < length; i++) {
    let city = cities[Math.floor(Math.random() * cities.length)]
    let town = city.towns[Math.floor(Math.random() * city.towns.length)]
    data.push({ city: city.name, town: town })
  }
  return data.map(data => data.town + ', ' + data.city)
/* 
  return data.sort((a, b) => {
      if (a.city == b.city) {
        return a.town.localeCompare(b.town, 'tr-TR', { sensitivity: 'base' })
      }
      return a.city.localeCompare(b.city, 'tr-TR', { sensitivity: 'base' })
    })
    .map(data => data.town + ', ' + data.city)
 */
  }

export function supplyDistrictSlashCity(length: number, order?: string) {
  let data: any[] = []
  for (let i = 0; i < length; i++) {
    let city = cities[Math.floor(Math.random() * cities.length)]
    let town = city.towns[Math.floor(Math.random() * city.towns.length)]
    data.push({ city: city.name, town: town })
  }
  return data.map(data => data.town + '/ ' + data.city)
/* 
  return data.sort((a, b) => {
      if (a.city == b.city) {
        return a.town.localeCompare(b.town, 'tr-TR', { sensitivity: 'base' })
      }
      return a.city.localeCompare(b.city, 'tr-TR', { sensitivity: 'base' })
    })
    .map(data => data.town + ' / ' + data.city)
 */
  }

export function supplyDistrictsOfAnkara(length: number, order?: string) {
  let towns: string[] = []
  let city = cities.find(city => city.name == 'Ankara')
  if (city !== undefined) {
    switch (order) {
      case 'ascending':
        towns = orderAscendingData(city.towns)
        for (let i = 0; i < length; i++) {
          towns.push(city.towns[i % city.towns.length])
        }
        break
      case 'descending':
        towns = orderDescendingData(city.towns)
        for (let i = 0; i < length; i++) {
          towns.push(city.towns[i % city.towns.length])
        }
        break
      default:
        for (let i = 0; i < length; i++) {
          towns.push(city.towns[Math.floor(Math.random() * city.towns.length)])
        }
        break
    }
  }
  return towns
}

export function supplyDistrictsOfIstanbul(length: number, order?: string) {
  let towns: string[] = []
  let city = cities.find(city => city.name == 'İstanbul')
  if (city !== undefined) {
    switch (order) {
      case 'ascending':
        towns = orderAscendingData(city.towns)
        for (let i = 0; i < length; i++) {
          towns.push(city.towns[i % city.towns.length])
        }
        break
      case 'descending':
        towns = orderDescendingData(city.towns)
        for (let i = 0; i < length; i++) {
          towns.push(city.towns[i % city.towns.length])
        }
        break
      default:
        for (let i = 0; i < length; i++) {
          towns.push(city.towns[Math.floor(Math.random() * city.towns.length)])
        }
        break
    }
  }
  return towns
}

export function supplyCountry(length: number, order: string) {
  let data: string[] = []
  let names = countries.map(country => country.name)
    switch (order) {
      case 'ascending':
        names = orderAscendingData(names)
        for (let i = 0; i < length; i++) {
          data.push(names[i % names.length])
        }
        break
      case 'descending':
        names = orderDescendingData(names)
        for (let i = 0; i < length; i++) {
          data.push(names[i % names.length])
        }
        break
      default:
        for (let i = 0; i < length; i++) {
          data.push(names[Math.floor(Math.random() * names.length)])
        }
        break
    }
  return data
}
