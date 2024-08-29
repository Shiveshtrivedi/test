import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  saveAdminHistoryToCookies,
  getAdminHistoryFromCookies,
} from "../../utils/CookieUtils";
import { IProduct, IProductState } from "../../utils/interface/interface";

const initialState: IProductState = {
  products: [],
  adminProductsHistory: [],
  filterProducts: [],
  status: "idle",
  error: null,
  id: null,
};

export const fetchProducts = createAsyncThunk<IProduct[]>(
  "products/fetchProducts",
  async () => {
    const response = await axios.get("https://fakestoreapi.com/products");
    return response.data;
  }
);

export const addProduct = createAsyncThunk<IProduct, IProduct>(
  "products/addProduct",
  async (newProduct) => {
    const response = await axios.post(
      "https://fakestoreapi.com/products",
      newProduct
    );
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("products/deleteProduct", async (productId, { rejectWithValue }) => {
  try {
    await axios.delete(`https://fakestoreapi.com/products/${productId}`);
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to delete product");
  }
});


export const fetchProductsByCategory = createAsyncThunk<
  IProduct[],
  string,
  { rejectValue: string }
>("products/fetchProductsByCategory", async (category, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `https://fakestoreapi.com/products/category/${category}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to fetch products");
  }
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setUserId(state, action: PayloadAction<string>) {
      state.id = action.payload;
      state.adminProductsHistory = getAdminHistoryFromCookies(action.payload);
      console.log("Admin Products History:", state.adminProductsHistory);
    },

    addProductToHistory(state, action: PayloadAction<IProduct>) {
      const updatedHistory = [...state.adminProductsHistory, action.payload];
      state.adminProductsHistory = updatedHistory;

      if (state.id !== null) {
        saveAdminHistoryToCookies(state.id, updatedHistory);
        console.log("Updated Admin History Saved to Cookies:", updatedHistory);
      }
    },

    removeProductFromHistory(state, action: PayloadAction<string>) {
      if (!state.id) return;
      const updatedHistory = state.adminProductsHistory.filter(
        (product) => product.id !== action.payload
      );
      state.adminProductsHistory = updatedHistory;
    },

    clearHistory(state) {
      if (state.id) {
        state.adminProductsHistory = [];
        saveAdminHistoryToCookies(state.id, []);
        console.log("Admin History Cleared from Cookies");
      }
    },

    resetFilter(state) {
      state.filterProducts = [...state.products];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<IProduct[]>) => {
          state.status = "succeeded";
          state.products = action.payload;
          state.filterProducts = action.payload; 
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Failed to fetch products";
      })
      .addCase(
        addProduct.fulfilled,
        (state, action: PayloadAction<IProduct>) => {
          state.products.push(action.payload);
        }
      )
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.error.message ?? "Failed to add product";
      })
      .addCase(
        deleteProduct.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.error = action.payload ?? "Failed to delete product";
        }
      )
      .addCase(
        fetchProductsByCategory.fulfilled,
        (state, action: PayloadAction<IProduct[]>) => {
          state.status = "succeeded";
          state.products = action.payload;
          state.filterProducts = action.payload; 
        }
      )
      .addCase(
        fetchProductsByCategory.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "failed";
          state.error =
            action.payload ?? "Failed to fetch products by category";
        }
      );
  },
});

export const {
  setUserId,
  addProductToHistory,
  removeProductFromHistory,
  clearHistory,
  resetFilter,
} = productSlice.actions;

export default productSlice.reducer;
