import { Companies as Company } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface CompanyState {
  isLoading: boolean;
  item: Company | null;
  error: Error | null;
}

const initialState: CompanyState = {
  isLoading: false,
  item: null,
  error: null,
};

export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setCompany: (state, action: PayloadAction<Company>) => {
      state.item = action.payload;
    },
  },
});

export const { setCompany } = companySlice.actions;

export default companySlice.reducer;
