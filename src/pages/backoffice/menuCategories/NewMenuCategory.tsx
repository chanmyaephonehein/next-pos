import { config } from "@/config";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appData } from "@/store/slices/appSlice";
import { addMenuCategory } from "@/store/slices/menuCategoriesSlice";
import { fetchMenusMenuCategoriesLocations } from "@/store/slices/menusMenuCategoriesLocationsSlice";
import { getSelectedLocationId } from "@/utils/client";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { Locations as Location } from "@prisma/client";
import { useState } from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const NewMenuCategory = ({ open, setOpen }: Props) => {
  const { locations } = useAppSelector(appData);
  const [newMenuCategory, setNewMenuCategory] = useState({
    name: "",
    locationIds: [] as number[],
  });
  const dispatch = useAppDispatch();
  const selectedLocationId = getSelectedLocationId() as string;

  const createNewMenuCategory = async () => {
    if (!newMenuCategory.name || !newMenuCategory.locationIds.length)
      return console.log("Please enter menu name");
    const response = await fetch(`${config.apiBaseUrl}/menuCategories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMenuCategory),
    });
    const menuCategoryCreated = await response.json();
    dispatch(addMenuCategory(menuCategoryCreated));
    dispatch(fetchMenusMenuCategoriesLocations(selectedLocationId));
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Create new menu category</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          minWidth: 300,
          minHeight: 150,
        }}
      >
        <TextField
          label="Name"
          variant="outlined"
          sx={{ my: 2 }}
          onChange={(evt) =>
            setNewMenuCategory({ ...newMenuCategory, name: evt.target.value })
          }
        />
        <FormControl>
          <InputLabel id="select-menu-categories">Locations</InputLabel>
          <Select
            label="Locations"
            multiple
            value={newMenuCategory.locationIds}
            onChange={(evt) => {
              const values = evt.target.value as number[];
              setNewMenuCategory({ ...newMenuCategory, locationIds: values });
            }}
            input={<OutlinedInput label="Locations" />}
            renderValue={(values) => {
              const selectedLocations = newMenuCategory.locationIds.map(
                (locationId) => {
                  return locations.find(
                    (location) => location.id === locationId
                  ) as Location;
                }
              );
              return selectedLocations
                .map((selectedLocation) => selectedLocation.name)
                .join(", ");
            }}
            MenuProps={MenuProps}
          >
            {locations.map((location) => (
              <MenuItem key={location.id} value={location.id}>
                <Checkbox
                  checked={
                    location.id &&
                    newMenuCategory.locationIds.includes(location.id)
                      ? true
                      : false
                  }
                />
                <ListItemText primary={location.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={createNewMenuCategory}
          sx={{ width: "fit-content", alignSelf: "flex-end", mt: 2 }}
        >
          Create
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default NewMenuCategory;
