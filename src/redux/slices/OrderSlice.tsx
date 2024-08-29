// redux/slices/OrderSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IOrder, IOrderState } from "../../utils/interface/interface";
import { saveOrdersToCookies, getOrdersFromCookies } from "../../utils/CookieUtils";

const initialState: IOrderState = {
  orders: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    initializeOrders(state, action: PayloadAction<string>) {
      // Load orders from cookies when initializing
      state.orders = getOrdersFromCookies(action.payload);
    },
    addOrder(state, action: PayloadAction<IOrder>) {
      state.orders.push(action.payload);
      console.log("Order added to history:", action.payload);

      // Save updated orders to cookies
      const userId = action.payload.userId; // Ensure you have userId in your IOrder
      if (userId) {
        saveOrdersToCookies(userId, state.orders);
      }
    },
  },
});

export const { initializeOrders, addOrder } = orderSlice.actions;
export default orderSlice.reducer;
