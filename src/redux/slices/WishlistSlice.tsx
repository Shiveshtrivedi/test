import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  saveWishlistToCookies,
  getWishlistFromCookies,
} from "../../utils/CookieUtils";
import { IWishListItem, IWishListState } from "../../utils/interface/interface";

const initialState: IWishListState = {
  items: [],
  userId: null,
};

const wishListSlice = createSlice({
  name: "wishList",
  initialState,
  reducers: {
    setUserId(state, action: PayloadAction<string>) {
      state.userId = action.payload;
      state.items = getWishlistFromCookies(action.payload);
    },
    addToWishList(state, action: PayloadAction<IWishListItem>) {
      console.log("add to wishlist", action.payload);
      console.log("Current items in wishlist before find:", state.items);
      if (!state.userId) return;
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (!existingItem) {
        state.items = [...state.items, action.payload]; // Immutable update
        console.log("existing item", state.items);
        saveWishlistToCookies(state.userId, state.items);
      } else {
        console.log("item found");
      }
    },
    removeToWishList(state, action: PayloadAction<number>) {
      if (!state.userId) return;
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveWishlistToCookies(state.userId, state.items);
    },
  },
});

export const { addToWishList, removeToWishList, setUserId } =
  wishListSlice.actions;
export default wishListSlice.reducer;
