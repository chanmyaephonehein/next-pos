import { Menus as Menu, Addons as Addon } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

export interface CartItem {
  id: string;
  menu: Menu;
  addons: Addon[];
  quantity: number;
}

interface CartState {
  isLoading: boolean;
  items: CartItem[];
  error: Error | null;
}

const initialState: CartState = {
  isLoading: false,
  items: [],
  error: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.items = [...state.items, action.payload];
    },
    updateCart: (state, action: PayloadAction<CartItem>) => {
      state.items = state.items.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    removeFromCart: (state, action: PayloadAction<CartItem>) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
    emptyCart: (state) => {
      state.items = [];
    },
  },
});

export const selectCart = (state: RootState) => state.cart;

export const { addToCart, updateCart, removeFromCart, emptyCart } =
  cartSlice.actions;

export default cartSlice.reducer;
