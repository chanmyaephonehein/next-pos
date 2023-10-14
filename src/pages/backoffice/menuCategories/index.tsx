import ItemCard from "@/components/ItemCard";
import Loading from "@/components/Loading";
import { useAppSelector } from "@/store/hooks";
import { appData } from "@/store/slices/appSlice";
import { getSelectedLocationId } from "@/utils/client";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import NewMenuCategory from "./NewMenuCategory";

const MenuCategories = () => {
  const { isLoading, menuCategories, menusMenuCategoriesLocations } =
    useAppSelector(appData);
  const [open, setOpen] = useState(false);
  const selectedLocationId = getSelectedLocationId() as string;

  const validMenuCategoryIds = menusMenuCategoriesLocations
    .filter((item) => item.locationId === parseInt(selectedLocationId, 10))
    .map((item) => item.menuCategoryId);

  const filteredMenuCategories = menuCategories.filter(
    (item) => item.id && validMenuCategoryIds.includes(item.id)
  );

  const getMenusCount = (menuCategoryId?: number) => {
    if (!menuCategoryId) return 0;
    return menusMenuCategoriesLocations.filter(
      (item) =>
        item.menuCategoryId === menuCategoryId &&
        item.menuId &&
        item.locationId === Number(selectedLocationId)
    ).length;
  };

  if (isLoading) return <Loading />;

  return (
    <Box>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={() => setOpen(true)}
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "#4C4C6D",
              width: "fit-content",
              color: "#E8F6EF",
              mb: 2,
              ":hover": {
                bgcolor: "#1B9C85", // theme.palette.primary.main
                color: "white",
              },
            }}
          >
            New menu category
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {filteredMenuCategories.map((menuCategory) => (
            <ItemCard
              key={menuCategory.id}
              icon={
                <CategoryIcon
                  sx={{ fontSize: "60px", mb: 1.5, color: "#1B9C85" }}
                />
              }
              href={`/backoffice/menuCategories/${menuCategory.id}`}
              title={menuCategory.name}
              subtitle={`${getMenusCount(menuCategory.id)} menus`}
            />
          ))}
        </Box>
      </Box>
      <NewMenuCategory open={open} setOpen={setOpen} />
    </Box>
  );
};

export default MenuCategories;
