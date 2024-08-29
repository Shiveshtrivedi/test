import Cookies from "js-cookie";
import { IOrder } from "./interface/interface";

interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}

interface AddressDetails {
  name: string;
  pincode: string;
  phoneNumber: string;
  city: string;
  state: string;
}

export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
): void => {
  Cookies.set(name, value, { ...options, expires: 1, sameSite: "Strict" });
};

export const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

export const removeCookie = (name: string): void => {
  Cookies.remove(name);
};

const getUserCartKey = (userId: string) => `cart_${userId}`;

export const saveCartToCookies = (userId: string, cart: any) => {
  console.log("user id : ",userId);
  console.log("cart : ",cart);
  const cartKey = getUserCartKey(userId);
  Cookies.set(cartKey, JSON.stringify(cart), {
    expires: 7,
    sameSite: "Strict",
  });
  console.log("Cart saved to cookies:", cart);
};

export const getCartFromCookies = (userId: string) => {
  const cartKey = getUserCartKey(userId);
  const cart = Cookies.get(cartKey);
  console.log("Cart retrieved from cookies:", cart);  
  return cart ? JSON.parse(cart) : [];
};
const getUserWishlistKey = (userId: string) => `wishlist_${userId}`;

export const saveWishlistToCookies = (userId: string, wishlist: any) => {
  const wishlistKey = getUserWishlistKey(userId);
  Cookies.set(wishlistKey, JSON.stringify(wishlist), {
    expires: 7,
    sameSite: "Strict",
  });
};

export const getWishlistFromCookies = (userId: string) => {
  const wishlistKey = getUserWishlistKey(userId);
  const wishlist = Cookies.get(wishlistKey);
  return wishlist ? JSON.parse(wishlist) : [];
};

const getAdminHistoryKey = (userId: string) => `adminHistory_${userId}`;

export const saveAdminHistoryToCookies = (userId: string, history: any[]) => {
  const historyKey = getAdminHistoryKey(userId);
  Cookies.set(historyKey, JSON.stringify(history), {
    expires: 7,
    sameSite: "Strict",
  });
};

export const getAdminHistoryFromCookies = (userId: string) => {
  const historyKey = getAdminHistoryKey(userId);
  const history = Cookies.get(historyKey);
  return history ? JSON.parse(history) : [];
};

export const removeAdminHistoryFromCookies = (userId: string) => {
  const historyKey = getAdminHistoryKey(userId);
  Cookies.remove(historyKey);
};

export const saveAddressToCookies = (
  userId: string,
  addressDetails: AddressDetails
) => {
  Cookies.set(`userAddress_${userId}`, JSON.stringify(addressDetails), {
    expires: 7,
  });
};

export const getAddressFromCookies = (
  userId: string
): AddressDetails | null => {
  const address = Cookies.get(`userAddress_${userId}`);
  
  return address ? JSON.parse(address) : null;
};


// utils/CookieUtils.ts

const getUserOrdersKey = (userId: string) => `orders_${userId}`;

export const saveOrdersToCookies = (userId: string, orders: IOrder[]) => {
  const ordersKey = getUserOrdersKey(userId);
  Cookies.set(ordersKey, JSON.stringify(orders), {
    expires: 7,
    sameSite: "Strict",
  });
  console.log("Orders saved to cookies:", orders);
};

export const getOrdersFromCookies = (userId: string): IOrder[] => {
  const ordersKey = getUserOrdersKey(userId);
  const orders = Cookies.get(ordersKey);
  console.log("Orders retrieved from cookies:", orders);  
  return orders ? JSON.parse(orders) : [];
};
