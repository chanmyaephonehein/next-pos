import { config } from "@/config";
import {
  PayloadAction,
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "..";
import { setAddonCategories } from "./addonCategoriesSlice";
import { setAddons } from "./addonsSlice";
import { setCompany } from "./companySlice";
import { setLocations } from "./locationsSlice";
import { setMenuCategories } from "./menuCategoriesSlice";
import { setMenusAddonCategories } from "./menusAddonCategoriesSlice";
import { setMenusMenuCategoriesLocations } from "./menusMenuCategoriesLocationsSlice";
import { setMenus } from "./menusSlice";
import { setOrderlines } from "./orderlinesSlice";
import { setOrders } from "./ordersSlice";
import { setTables } from "./tablesSlice";

interface AddonsState {
  isLoading: boolean;
  init: boolean;
  error: Error | null;
}

const initialState: AddonsState = {
  isLoading: false,
  init: false,
  error: null,
};

interface fetchAppDataPayload {
  locationId?: string;
}

export const fetchAppData = createAsyncThunk(
  "app/fetchAppData",
  async (payload: fetchAppDataPayload, thunkAPI) => {
    thunkAPI.dispatch(setAppLoading(true));
    const response = await fetch(
      `${config.apiBaseUrl}/app?locationId=${payload.locationId}`
    );
    const responseJson = await response.json();
    const {
      menus,
      menuCategories,
      addons,
      addonCategories,
      menusAddonCategories,
      locations,
      menusMenuCategoriesLocations,
      tables,
      orders,
      company,
      orderlines,
    } = responseJson;

    thunkAPI.dispatch(setAddons(addons));
    thunkAPI.dispatch(setMenus(menus));
    thunkAPI.dispatch(setMenuCategories(menuCategories));
    thunkAPI.dispatch(setAddonCategories(addonCategories));
    thunkAPI.dispatch(setLocations(locations));
    thunkAPI.dispatch(setMenusAddonCategories(menusAddonCategories));
    thunkAPI.dispatch(
      setMenusMenuCategoriesLocations(menusMenuCategoriesLocations)
    );
    thunkAPI.dispatch(setOrders(orders));
    thunkAPI.dispatch(setOrderlines(orderlines));
    thunkAPI.dispatch(setTables(tables));
    thunkAPI.dispatch(setCompany(company));
    thunkAPI.dispatch(setAppLoading(false));
    localStorage.setItem("selectedLocationId", locations[0].id);
    thunkAPI.dispatch(setInit(true));
  }
);

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setInit: (state, action: PayloadAction<boolean>) => {
      state.init = action.payload;
    },
    setAppLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setAppLoading, setInit } = appSlice.actions;

export const selectApp = (state: RootState) => state.app;
export const selectMenuCategories = (state: RootState) =>
  state.menuCategories.items;
export const selectMenus = (state: RootState) => state.menus.items;
export const selectMenusAddonCategories = (state: RootState) =>
  state.menusAddonCategories.items;
export const selectMenusMenuCategoriesLocations = (state: RootState) =>
  state.menusMenuCategoriesLocations.items;
export const selectAddons = (state: RootState) => state.addons.items;
export const selectAddonCategories = (state: RootState) =>
  state.addonCategories.items;
export const selectLocations = (state: RootState) => state.locations.items;
export const selectCompany = (state: RootState) => state.company.item;
export const selectTables = (state: RootState) => state.tables.items;
export const selectOrders = (state: RootState) => state.orders.items;
export const selectOrderlines = (state: RootState) => state.orderlines.items;

export const appData = createSelector(
  [
    selectApp,
    selectMenuCategories,
    selectMenus,
    selectMenusAddonCategories,
    selectMenusMenuCategoriesLocations,
    selectAddons,
    selectAddonCategories,
    selectLocations,
    selectCompany,
    selectTables,
    selectOrders,
    selectOrderlines,
  ],
  (
    app,
    menuCategories,
    menus,
    menusAddonCategories,
    menusMenuCategoriesLocations,
    addons,
    addonCategories,
    locations,
    company,
    tables,
    orders,
    orderlines
  ) => {
    return {
      isLoading: app.isLoading,
      menuCategories,
      menus,
      menusAddonCategories,
      menusMenuCategoriesLocations,
      addons,
      addonCategories,
      locations,
      company,
      tables,
      orders,
      orderlines,
    };
  }
);

export default appSlice.reducer;
