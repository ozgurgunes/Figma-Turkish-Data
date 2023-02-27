import {
  on,
  showUI,
  setRelaunchButton,
  EventHandler,
  traverseNode,
} from '@create-figma-plugin/utilities'
import {
  orderAscendingString,
  orderDescendingString,
  orderRandomString,
  getSelectedTextNodes,
  supplyData,
} from '../utils'

import cities from '../turkishData/locationCity'
import countries from '../turkishData/locationCountry'
import addresses from '../turkishData/locationAddress'

export interface PluginOptions {
  pick: string
  order: string
  city: string
}

export interface NameHandler extends EventHandler {
  name:
    | 'ADDRESS'
    | 'COMPLETE_ADDRESS'
    | 'CITY'
    | 'COUNTRY'
    | 'DISTRICT_SLASH_CITY'
    | 'DISTRICT_COMMA_CITY'
    | 'CITY_COMMA_DISTRICT'
    | 'CITY_TO_CITY'
    | 'DISTRICT_TO_DISTRICT'
  handler: (options: PluginOptions) => void
}

export default async function (): Promise<void> {
  setRelaunchButton(figma.currentPage, 'turkishLocation')
  const lastOptions = {
    pick: await figma.clientStorage.getAsync('location.pick'),
    order: await figma.clientStorage.getAsync('location.order'),
    city: await figma.clientStorage.getAsync('location.city'),
  }

  on<NameHandler>('ADDRESS', options => {
    supplyLocations(supplySimpleAddress, options)
  })
  on<NameHandler>('COMPLETE_ADDRESS', options => {
    supplyLocations(supplyCompleteAddress, options)
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
  on<NameHandler>('CITY_COMMA_DISTRICT', options => {
    supplyLocations(supplyCityCommaDistrict, options)
  })
  on<NameHandler>('CITY_TO_CITY', options => {
    supplyLocations(supplyCityToCity, options)
  })
  on<NameHandler>('DISTRICT_TO_DISTRICT', options => {
    supplyLocations(supplyDistrictToDistrict, options)
  })
  showUI(
    {
      width: 240,
      height: 576,
    },
    lastOptions
  )
}

async function supplyLocations(
  supplierFunction: Function,
  options: PluginOptions
) {
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
  const locations = supplierFunction(selectedNodes.length, options)
  supplyData(selectedNodes, orderFunction(locations))

  figma.clientStorage.setAsync('location.pick', options.pick)
  figma.clientStorage.setAsync('location.order', options.order)
  figma.clientStorage.setAsync('location.city', options.city)
}

function getRandomized(
  array: string[],
  length: number,
  options: PluginOptions
) {
  let locations: string[] = []
  for (let i = 0; i < length; i++) {
    locations.push(array[Math.floor(Math.random() * array.length)])
  }
  return locations
}
function getSequental(array: string[], length: number, options: PluginOptions) {
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

  let locations: string[] = []
  array = orderFunction(array)
  for (let i = 0; i < length; i++) {
    locations.push(array[i % array.length])
  }
  return locations
}

function supplySimpleAddress(length: number, options: PluginOptions) {
  let data = []
  for (let i = 0; i < length; i++) {
    data.push(getSimpleAddress(options))
  }
  return data
}

function getSimpleAddress(options: PluginOptions) {
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
  return (
    address +
    (Math.random() >= 0.5 ? '/' + (Math.floor(Math.random() * 25) + 1) : '')
  )
}

function supplyCompleteAddress(length: number, options: PluginOptions) {
  let data = []
  for (let i = 0; i < length; i++) {
    let address = getSimpleAddress(options)
    let city = getCity(options)
    let town = city.towns[Math.floor(Math.random() * city.towns.length)]
    data.push(address + ' ' + town + ', ' + city.name)
  }
  return data
}

function supplyCity(length: number, options: PluginOptions) {
  let data: string[] = []
  let names = cities.map(city => city.name)

  switch (options.pick) {
    case 'sequental':
      data = getSequental(names, length, options)
      break
    default:
      data = getRandomized(names, length, options)
      break
  }

  return data
}

function getCity(options: PluginOptions) {
  if (options.city) {
    let city = cities.find(city => city.name == options.city)
    if (city) return city
  }
  return cities[Math.floor(Math.random() * cities.length)]
}

function supplyDistrictCommaCity(length: number, options: PluginOptions) {
  let data: any[] = []
  for (let i = 0; i < length; i++) {
    let city = getCity(options)
    let town = city!.towns[Math.floor(Math.random() * city!.towns.length)]
    data.push({ city: city!.name, town: town })
  }
  return data.map(data => data.town + ', ' + data.city)
}

function supplyCityCommaDistrict(length: number, options: PluginOptions) {
  let data: any[] = []
  for (let i = 0; i < length; i++) {
    let city = getCity(options)
    let town = city.towns[Math.floor(Math.random() * city.towns.length)]
    data.push({ city: city.name, town: town })
  }
  return data.map(data => data.city + ', ' + data.town)
}

function supplyDistrictSlashCity(length: number, options: PluginOptions) {
  let data: any[] = []
  for (let i = 0; i < length; i++) {
    let city = getCity(options)
    let town = city.towns[Math.floor(Math.random() * city.towns.length)]
    data.push({ city: city.name, town: town })
  }
  return data.map(data => data.town + '/ ' + data.city)
}

function supplyCountry(length: number, options: PluginOptions) {
  let data: string[] = []
  let names = countries.map(country => country.name)

  switch (options.pick) {
    case 'sequental':
      data = getSequental(names, length, options)
      break
    default:
      data = getRandomized(names, length, options)
      break
  }
  return data
}

function supplyCityToCity(length: number, options: PluginOptions) {
  let data: string[] = []
  let names = cities.map(city => city.name)
  for (let i = 0; i < length; i++) {
    let city = names[Math.floor(Math.random() * names.length)]
    data.push(
      city +
        ' - ' +
        names.filter(name => name != city)[
          Math.floor(Math.random() * (names.length - 1))
        ]
    )
  }
  return data
}

function supplyDistrictToDistrict(length: number, options: PluginOptions) {
  let data: string[] = []
  let names = cities.find(city => city.name == 'İstanbul')?.towns
  if (names !== undefined) {
    for (let i = 0; i < length; i++) {
      let district = names[Math.floor(Math.random() * names.length)]
      data.push(
        district +
          ' - ' +
          names.filter(name => name != district)[
            Math.floor(Math.random() * (names.length - 1))
          ]
      )
    }
  }
  return data
}
