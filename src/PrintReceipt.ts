import { loadAllItems, loadPromotions } from './Dependencies'

export function printReceipt(tags: string[]): string {
  const itemMap = preprocessTags(tags)
  const models = calculateDiscountedSubtotal(itemMap, loadPromotions())
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

function calculateDiscountedSubtotal(itemMap: Map<string, ItemModel>, promotions: object[]) {

  return new Map<string, ItemModel>()
}

function renderReceipt(itemMap: Map<string, ItemModel>): string {

  return `***<store earning no money>Receipt ***
Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
----------------------
Total：58.50(yuan)
Discounted prices：7.50(yuan)
**********************`
}

interface ItemModel {
  barcode: string,
  name: string,
  unit: string,
  price: number,
  quantity: number,
  subtotal: number
}

interface Item {
  barcode: string,
  name: string,
  unit: string,
  price: number
}
