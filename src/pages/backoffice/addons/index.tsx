import ItemCard from "@/components/ItemCard";
import Loading from "@/components/Loading";
import { useAppSelector } from "@/store/hooks";
import { appData } from "@/store/slices/appSlice";
import { getAddonsByLocationId, getSelectedLocationId } from "@/utils/client";
import AddIcon from "@mui/icons-material/Add";
import EggIcon from "@mui/icons-material/Egg";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import NewAddon from "./NewAddon";

const Addons = () => {
  const {
    isLoading,
    addons,
    menusAddonCategories,
    menusMenuCategoriesLocations,
  } = useAppSelector(appData);
  const [open, setOpen] = useState(false);

  const selectedLocationId = getSelectedLocationId() as string;
  const validAddons = getAddonsByLocationId(
    addons,
    menusAddonCategories,
    menusMenuCategoriesLocations,
    selectedLocationId
  );

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
            New addon
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {validAddons.map((addon) => (
            <ItemCard
              key={addon.id}
              icon={
                <EggIcon sx={{ fontSize: "60px", mb: 1.5, color: "#1B9C85" }} />
              }
              href={`/backoffice/addons/${addon.id}`}
              title={addon.name}
              subtitle={`${addon.price} kyat`}
            />
          ))}
        </Box>
      </Box>
      <NewAddon open={open} setOpen={setOpen} />
    </Box>
  );
};

export default Addons;
