import { CartItem } from './customTypes';

const DATABASE_NAME = 'cartDatabase';
const STORE_NAME = 'cartItems';
const DB_VERSION = 1;

export const initDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DB_VERSION);

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // Create an object store for the cart
        db.createObjectStore(STORE_NAME, { keyPath: 'id' }); // Use a fixed key for the single row
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveOrUpdateCartLocal = async (
  cartItems: CartItem[]
): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Save the entire array as a single object with a fixed key
    const cart = { id: STORE_NAME, cartItems };

    const request = store.put(cart);

    request.onsuccess = () => {
      console.log('Cart saved/updated successfully');
      resolve();
    };

    request.onerror = event => {
      console.error(
        'Error saving/updating cart:',
        (event.target as IDBRequest).error
      );
      reject((event.target as IDBRequest).error);
    };
  });
};

export const getCartLocal = async (): Promise<CartItem[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(STORE_NAME); // Retrieve the single row by its key

    request.onsuccess = () => {
      const cart = request.result;
      console.log(cart);
      if (cart && cart.cartItems) {
        console.log('Retrieved cart items:', cart.cartItems);
        resolve(cart.cartItems);
      } else {
        console.log('Cart is empty');
        resolve([]);
      }
    };

    request.onerror = event => {
      console.error(
        'Error retrieving cart:',
        (event.target as IDBRequest).error
      );
      reject((event.target as IDBRequest).error);
    };
  });
};

export const clearCartLocal = async (): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(STORE_NAME); // Delete the single row by its key

    request.onsuccess = () => {
      console.log('Cart cleared successfully');
      resolve();
    };

    request.onerror = event => {
      console.error('Error clearing cart:', (event.target as IDBRequest).error);
      reject((event.target as IDBRequest).error);
    };
  });
};
