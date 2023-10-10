import { config } from "@/config";
import { OrderStatus, Orderlines as Orderline } from "@prisma/client";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface OrderlinesState {
  isLoading: boolean;
  items: Orderline[];
  error: Error | null;
}

const initialState: OrderlinesState = {
  isLoading: false,
  items: [],
  error: null,
};

interface UpdateOrderlinePayload {
  itemId: string;
  status: OrderStatus;
}

export const updateOrderlineStatus = createAsyncThunk(
  "orderlines/updateOrderlineStatus",
  async (payload: UpdateOrderlinePayload, thunkAPI) => {
    await fetch(`${config.apiBaseUrl}/orderlines`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    thunkAPI.dispatch(updateOrderline(payload));
  }
);

export const orderlinesSlice = createSlice({
  name: "orderlines",
  initialState,
  reducers: {
    setOrderlines: (state, action) => {
      state.items = action.payload;
    },
    updateOrderline: (
      state,
      action: PayloadAction<{ itemId: string; status: OrderStatus }>
    ) => {
      state.items = state.items.map((item) => {
        if (item.itemId === action.payload.itemId) {
          return { ...item, status: action.payload.status };
        }
        return item;
      });
    },
  },
});

export const { setOrderlines, updateOrderline } = orderlinesSlice.actions;

export default orderlinesSlice.reducer;
