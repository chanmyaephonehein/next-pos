import MenuCard from "@/components/MenuCard";
import { useAppSelector } from "@/store/hooks";
import { appData } from "@/store/slices/appSlice";
import { getMenusByMenuCategoryId } from "@/utils/client";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { MenuCategories as MenuCategory } from "@prisma/client";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

const OrderApp = () => {
  const router = useRouter();
  const query = router.query;
  const selectedLocationId = query.locationId as string;
  const { menuCategories, menus, menusMenuCategoriesLocations } =
    useAppSelector(appData);
  const [value, setValue] = useState(0);
  const [selectedMenuCategory, setSelectedMenuCategory] =
    useState<MenuCategory>();

  useEffect(() => {
    if (menuCategories.length) {
      setSelectedMenuCategory(menuCategories[0]);
    }
  }, [menuCategories]);

  const renderMenus = useCallback(() => {
    const isValid = selectedLocationId && selectedMenuCategory;
    if (!isValid) return;
    const menuCategoryId = String(selectedMenuCategory.id);
    const validMenus = getMenusByMenuCategoryId(
      menus,
      menuCategoryId,
      menusMenuCategoriesLocations,
      selectedLocationId
    );

    return validMenus.map((item) => {
      const href = { pathname: `/order/menus/${item.id}`, query };
      return <MenuCard key={item.id} menu={item} href={href} />;
    });
  }, [selectedMenuCategory, menus]);

  return (
    <Box>
      <Box>
        <Tabs
          TabIndicatorProps={{
            style: { background: "#1B9C85" },
          }}
          value={value}
          onChange={(evt, value) => setValue(value)}
          variant="scrollable"
          sx={{
            ".Mui-selected": {
              color: "#1B9C85 !important",
              fontWeight: "bold",
            },
          }}
        >
          {menuCategories.map((item) => {
            return (
              <Tab
                key={item.id}
                label={item.name}
                sx={{ color: "#4C4C6D" }}
                onClick={() => setSelectedMenuCategory(item)}
              />
            );
          })}
        </Tabs>
      </Box>
      <Box sx={{ pt: 2, display: "flex" }}>{renderMenus()}</Box>
    </Box>
  );
};

export default OrderApp;
