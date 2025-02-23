import { CartItem } from './customTypes';

// Combine state CartItems with Local and Remote databases' CartItems
export const combineCartItems = (
  cart1: CartItem[],
  cart2: CartItem[]
): CartItem[] => {
  const combinedCartMap = new Map<string, CartItem>();

  // Helper function to add items to the map
  const addToMap = (item: CartItem) => {
    if (combinedCartMap.has(item._id)) {
      // If the item already exists, update the quantity
      const existingItem = combinedCartMap.get(item._id)!;

      combinedCartMap.set(item._id, {
        ...existingItem,
        quantity: existingItem.quantity + item.quantity,
      });
    } else {
      // If the item doesn't exist, add it to the map
      combinedCartMap.set(item._id, item);
    }
  };

  // Add all items from the first cart to the map
  cart1.forEach(addToMap);

  cart2.forEach(addToMap);

  return Array.from(combinedCartMap.values());
};
