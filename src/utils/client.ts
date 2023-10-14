import { config } from "@/config";
import {
  Addons as Addon,
  AddonCategories as AddonCategory,
  Locations as Location,
  Menus as Menu,
  MenusAddonCategories as MenusAddonCategory,
  MenusMenuCategoriesLocations as MenusMenuCategoriesLocations,
  Orderlines as Orderline,
} from "@prisma/client";
import { CartItem } from "@/store/slices/cartSlice";

export const getSelectedLocationId = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("selectedLocationId");
  }
  return "";
};

export const getMenusByMenuCategoryId = (
  menus: Menu[],
  menuCategoryId: string,
  menusMenuCategoriesLocations: MenusMenuCategoriesLocations[],
  selectedLocationId: string
) => {
  const validMenuIds = menusMenuCategoriesLocations
    .filter(
      (item) =>
        item.menuId &&
        item.menuCategoryId === Number(menuCategoryId) &&
        item.locationId === Number(selectedLocationId)
    )
    .map((item) => item.menuId);
  return menus.filter((item) => validMenuIds.includes(item.id));
};

export const getLocationsByMenuCategoryId = (
  locations: Location[],
  menuCategoryId: string,
  menusMenuCategoriesLocations: MenusMenuCategoriesLocations[]
) => {
  const validLocationIds = menusMenuCategoriesLocations
    .filter((item) => item.menuCategoryId === Number(menuCategoryId))
    .map((item) => item.locationId);
  return locations.filter((item) => validLocationIds.includes(item.id));
};

export const getAddonCategoriesByMenuId = (
  addonCategories: AddonCategory[],
  menuId: string,
  menusAddonCategories: MenusAddonCategory[]
) => {
  const validAddonCategoryIds = menusAddonCategories
    .filter((item) => item.menuId === Number(menuId))
    .map((item) => item.addonCategoryId);
  return addonCategories.filter((item) =>
    validAddonCategoryIds.includes(item.id)
  );
};

export const getAddonsByLocationId = (
  addons: Addon[],
  menusAddonCategories: MenusAddonCategory[],
  menusMenuCategoriesLocations: MenusMenuCategoriesLocations[],
  selectedLocationId: string
) => {
  const validMenuIds = menusMenuCategoriesLocations
    .filter(
      (item) => item.menuId && item.locationId === Number(selectedLocationId)
    )
    .map((item) => item.menuId);
  const validAddonCategoryIds = menusAddonCategories
    .filter((item) => validMenuIds.includes(item.menuId as number))
    .map((item) => item.addonCategoryId);
  return addons.filter((item) =>
    validAddonCategoryIds.includes(item.addonCategoryId as number)
  );
};

export const getQrCodeUrl = (locationId: number, tableId: number) => {
  return `https://msquarefdc.sgp1.cdn.digitaloceanspaces.com/foodie-pos/qrcode/msquare/locationId-${locationId}-tableId-${tableId}.png`;
};

export const getNumberOfMenusByOrderId = (
  orderlines: Orderline[],
  orderId: number
): number => {
  const validOrderlines = orderlines.filter((item) => item.orderId === orderId);
  const menuIds: number[] = [];
  validOrderlines.forEach((item) => {
    const hasAdded = menuIds.find((menuId) => menuId === item.menuId);
    if (!hasAdded) menuIds.push(item.menuId);
  });
  return menuIds.length;
};

export const getCartTotalPrice = (cart: CartItem[]) => {
  const totalPrice = cart.reduce((prev, curr) => {
    const menuPrice = curr.menu.price;
    const totalAddonPrice = curr.addons.reduce(
      (addonPrice, addon) => (addonPrice += addon.price),
      0
    );
    prev += (menuPrice + totalAddonPrice) * curr.quantity;
    return prev;
  }, 0);
  return totalPrice;
};

export const generateRandomId = () =>
  (Math.random() + 1).toString(36).substring(7);

export const getMenuByMenuId = (menus: Menu[], menuId: number) =>
  menus.find((item) => item.id === menuId);

export const getAddonByAddonId = (addons: Addon[], addonId: number) =>
  addons.find((item) => item.id === addonId);
