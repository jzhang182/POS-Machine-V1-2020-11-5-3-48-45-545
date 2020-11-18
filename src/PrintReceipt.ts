import { loadAllItems, loadPromotions } from './Dependencies'

export function printReceipt(tags: string[]): string {
  const itemMap = preprocessTags(tags)
  const models = calculateDiscountedSubtotal(itemMap)
  return renderReceipt(models)
}

function preprocessTags(tags: string[]) {
  const items = loadAllItems()
  const itemMap = new Map<string, ItemModel>()
  for (const singleInput of tags) {
    const tag: string = singleInput.split('-')[0]
    let currQuantity
    if (singleInput.split('-').length === 1) { currQuantity = 1 }
    else { currQuantity = (Number)(singleInput.split('-')[1]) }

    if (itemMap.has(tag)) {
      itemMap.get(tag)!.quantity += currQuantity
    }
    else {
      const item = items.find(item => item.barcode === tag)!
      itemMap.set(tag, { barcode: item.barcode, name: item.name, unit: item.unit, price: item.price, quantity: currQuantity, subtotal: 0 } as ItemModel)
    }
  }
  return itemMap
}

function calculateDiscountedSubtotal(itemMap: Map<string, ItemModel>) {
  const promotedItems = loadPromotions()[0].barcodes
  return Array.from(itemMap).map(x => {
    if (promotedItems.find(barcode => barcode === x[1].barcode) !== null) {
      x[1].subtotal = x[1].price * (x[1].quantity - Math.floor(x[1].quantity / 3))
    }
    else { x[1].subtotal = x[1].price * x[1].quantity }
    return x[1]
  })
}

function renderReceipt(itemModels: ItemModel[]): string {
  let total = 0
  let discount = 0
  let ret = `***<store earning no money>Receipt ***\n`
  itemModels.forEach(x => {
    total += x.subtotal
    discount += (x.quantity * x.price - x.subtotal)
    ret += `Name：${x.name}，Quantity：${x.quantity} ${x.unit}s，Unit：${x.price.toFixed(2)}(yuan)，Subtotal：${x.subtotal.toFixed(2)}(yuan)\n`
  })
  ret +=
    `----------------------
Total：${total.toFixed(2)}(yuan)
Discounted prices：${discount.toFixed(2)}(yuan)
**********************`
  return ret
}

interface ItemModel {
  barcode: string,
  name: string,
  unit: string,
  price: number,
  quantity: number,
  subtotal: number
}
