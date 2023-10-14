import ItemCard from "@/components/ItemCard";
import Loading from "@/components/Loading";
import { useAppSelector } from "@/store/hooks";
import { appData } from "@/store/slices/appSlice";
import { getSelectedLocationId } from "@/utils/client";
import AddIcon from "@mui/icons-material/Add";
import ClassIcon from "@mui/icons-material/Class";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import NewAddonCategory from "./NewAddonCategory";

const AddonCategories = () => {
  const selectedLocationId = getSelectedLocationId();
  const {
    isLoading,
    addonCategories,
    addons,
    menusAddonCategories,
    menusMenuCategoriesLocations,
  } = useAppSelector(appData);
  const [open, setOpen] = useState(false);
  const validMenuIds = menusMenuCategoriesLocations
    .filter(
      (item) => item.menuId && item.locationId === Number(selectedLocationId)
    )
    .map((item) => item.menuId as number);
  const validAddonCategoryIds = menusAddonCategories
    .filter((item) => item.menuId && validMenuIds.includes(item.menuId))
    .map((item) => item.addonCategoryId);
  const validAddonCategories = addonCategories.filter((item) =>
    validAddonCategoryIds.includes(item.id)
  );

  const getAddonsCount = (addonCategoryId?: number) => {
    if (!addonCategoryId) return 0;
    return addons.filter((item) => item.addonCategoryId === addonCategoryId)
      .length;
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
            New addon category
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {validAddonCategories.map((addonCategory) => (
            <ItemCard
              key={addonCategory.id}
              icon={
                <ClassIcon
                  sx={{ fontSize: "60px", mb: 1.5, color: "#1B9C85" }}
                />
              }
              href={`/backoffice/addonCategories/${addonCategory.id}`}
              title={addonCategory.name}
              subtitle={`${getAddonsCount(addonCategory.id)} addons`}
            />
          ))}
        </Box>
      </Box>
      <NewAddonCategory open={open} setOpen={setOpen} />
    </Box>
  );
};

export default AddonCategories;
