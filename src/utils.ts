import { traverseNode } from '@create-figma-plugin/utilities'

export function getSelectedTextNodes(): Array<TextNode> {
  const nodes = figma.currentPage.selection
  const result: Array<TextNode> = []
  for (const node of nodes) {
    traverseNode(node, function (childNode: SceneNode) {
      if (childNode.type !== 'TEXT') {
        return
      }
      result.push(childNode)
    })
  }
  return result
}

// export async function supplyData(data: Array<string>) {
//   if (selectedNodes.length == 0) {
//     figma.closePlugin(`⚠️   Please select text nodes first.`)
//   }
//   return data
//   // var pending = selectedNodes.length
//   // await Promise.all(
//   //   selectedNodes.map((textNode: TextNode) => {
//   //     figma.loadFontAsync(textNode.fontName as FontName).then(() => {
//   //       textNode.characters = data[selectedNodes.length-pending]
//   //       pending--
//   //       if (pending == 0) {
//   //         figma.closePlugin(`✅   ${selectedNodes.length} text nodes converted.`)
//   //       }
//   //     })
//   //   })
//   // )
// }

export function orderAscendingData(data: Array<string>) {
  return data.sort((a, b) => a.localeCompare(b, 'tr-TR', { sensitivity: 'base' }))

}
export function orderDescendingData(data: Array<string>) {
  return data.sort((a, b) => b.localeCompare(a, 'tr-TR', { sensitivity: 'base' }))

}

export function orderRandomData(data: Array<string>) {
  return shuffle(data)
}

export function orderAscendingdDateTime(data: Array<Date>, options:Object) {
  return data
      .sort((a, b) => a > b ? 1 : -1)
      .map(date => date.toLocaleDateString('tr-TR', options))
  
}

export function orderDescendingDateTime(data: Array<Date>, options:Object) {
  return data
      .sort((a, b) => a < b ? 1 : -1)
      .map(date => date.toLocaleDateString('tr-TR', options))
  
}

export function orderRandomDateTime(data: Array<Date>, options:Object) {
  return shuffle (data.map(date => date.toLocaleDateString('tr-TR', options)))
}

export function orderAscendingTime(data: Array<Date>, options:Object) {
  return data
      .sort((a, b) => a > b ? 1 : -1)
      .map(date => date.toLocaleTimeString('tr-TR', options))
  
}

export function orderDescendingTime(data: Array<Date>, options:Object) {
  return data
      .sort((a, b) => a < b ? 1 : -1)
      .map(date => date.toLocaleTimeString('tr-TR', options))
  
}

export function orderRandomTime(data: Array<Date>, options:Object) {
  return shuffle(data.map(date => date.toLocaleTimeString('tr-TR', options)))
}

export function shuffle(array: Array<string>) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

export const dateTimeFormats = {
  HhMm: {
    hour: '2-digit',
    minute: '2-digit',
  },
  HhMmSs: {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  },
  DdMmYY: {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  },
  DdMmYyyy: {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  },
  DdMmmYyyy: {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  },
  DdMmmmYyyy: {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  },
  DdMmmmYyyyDddd: {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  },
  DdMmYyHhMm: {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  },
  DdMmYyyyHhMm: {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  },
  DdMmmmYyyyDdddHhMm: {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'long',
  },
}
