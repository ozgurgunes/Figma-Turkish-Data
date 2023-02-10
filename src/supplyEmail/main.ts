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
  domain: string
}
import latinize from 'latinize'

export interface EmailHandler extends EventHandler {
  name: 'FIRST_LAST' | 'FIRST_DOT_LAST' | 'F_DOT_LAST' | 'F_LAST'
  handler: (options: PluginOptions) => void
}

export default async function (): Promise<void> {
  setRelaunchButton(figma.currentPage, 'turkishEmail')
  let lastOptions = {
    order: await figma.clientStorage.getAsync('email.order'),
    gender: await figma.clientStorage.getAsync('email.gender'),
    domain: await figma.clientStorage.getAsync('email.domain'),
  }

  function getDomain(domain:string) {
    let domains = ['google.com', 'yahoo.com', 'hotmail.com', 'icloud.com']
    return (domain) ? domain : domains[Math.floor(Math.random() * domains.length)]
  }

  function supplyEmails(supplierFunction: Function, options: PluginOptions) {
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
    const names:string[] = supplierFunction(selectedNodes.length, options.gender)
    supplyData(selectedNodes, orderFunction(names.map(e => e+'@'+getDomain(options.domain))))

    figma.clientStorage.setAsync('email.order', options.order)
    figma.clientStorage.setAsync('email.gender', options.gender)
    figma.clientStorage.setAsync('email.domain', options.domain)
  }

  on<EmailHandler>('FIRST_LAST', options => {
    supplyEmails(getFirstLastEmails, options)
  })
  on<EmailHandler>('FIRST_DOT_LAST', options => {
    supplyEmails(getFirstDotLastEmails, options)
  })
  on<EmailHandler>('F_DOT_LAST', options => {
    supplyEmails(getFDotLastEmails, options)
  })
  on<EmailHandler>('F_LAST', options => {
    supplyEmails(getFLastEmails, options)
  })

  showUI(
    {
      width: 240,
      height: 392,
    },
    lastOptions
  )
}

function supplyFirstNames(gender: string) {
  let names = []
  switch (gender) {
    case 'female':
      names = femaleNames
      break
    case 'male':
      names = maleNames
      break
    default:
      names = femaleNames.concat(maleNames)
      break
  }
  return names
}

function getFirstLastEmails(length: number, gender: string) {
  let names: string[] = []
  let firstNames = supplyFirstNames(gender)
  for (let i = 0; i < length; i++) {
    names.push(
      latinize(
        firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase()
      )
    )
  }
  return names.map(n => {
    return (
      n +
      '' +
      latinize(
        lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase()
      )
    )
  })
}

function getFirstDotLastEmails(length: number, gender: string) {
  let names: string[] = []
  let firstNames = supplyFirstNames(gender)
  for (let i = 0; i < length; i++) {
    names.push(
      latinize(
        firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase()
      )
    )
  }
  return names.map(n => {
    return (
      n +
      '.' +
      latinize(
        lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase()
      )
    )
  })
}

function getFDotLastEmails(length: number, gender: string) {
  let names: string[] = []
  let firstNames = supplyFirstNames(gender)
  for (let i = 0; i < length; i++) {
    names.push(
      latinize(
        firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase()[0]
      )
    )
  }
  return names.map(n => {
    return (
      n +
      '.' +
      latinize(
        lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase()
      )
    )
  })
}

function getFLastEmails(length: number, gender: string) {
  let names: string[] = []
  let firstNames = supplyFirstNames(gender)
  for (let i = 0; i < length; i++) {
    names.push(
      latinize(
        firstNames[Math.floor(Math.random() * firstNames.length)].toLowerCase()[0]
      )
    )
  }
  return names.map(n => {
    return (
      n +
      '' +
      latinize(
        lastNames[Math.floor(Math.random() * lastNames.length)].toLowerCase()
      )
    )
  })
}
