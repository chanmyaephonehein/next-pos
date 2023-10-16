import FileDropZone from "@/components/FileDropZone";
import { config } from "@/config";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appData } from "@/store/slices/appSlice";
import { fetchMenusMenuCategoriesLocations } from "@/store/slices/menusMenuCategoriesLocationsSlice";
import { addMenu } from "@/store/slices/menusSlice";
import { getSelectedLocationId } from "@/utils/client";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Checkbox,
  Chip,
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
import { useState } from "react";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const NewMenu = ({ open, setOpen }: Props) => {
  let { menuCategories, menusMenuCategoriesLocations } =
    useAppSelector(appData);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMenuCategoryIds, setSelectedMenuCategoryIds] = useState<
    number[]
  >([]);
  const selectedLocationId = getSelectedLocationId() as string;
  const validMenuCategoryIds = menusMenuCategoriesLocations
    .filter(
      (item) =>
        item.menuCategoryId &&
        item.locationId === parseInt(selectedLocationId, 10)
    )
    .map((item) => item.menuCategoryId);
  menuCategories = menuCategories.filter(
    (item) => item.id && validMenuCategoryIds.includes(item.id)
  );
  const [menuImage, setMenuImage] = useState<File>();
  const [menu, setMenu] = useState({
    name: "",
    price: 0,
    description: "",
    locationIds: [parseInt(selectedLocationId, 10)],
    menuCategoryIds: selectedMenuCategoryIds,
    isAvailable: true,
    assetUrl: "",
  });

  const isDisabled =
    !menu.name || !menu.description || !menu.menuCategoryIds.length;

  const onFileSelected = (files: File[]) => {
    setMenuImage(files[0]);
  };

  const createNewMenu = async () => {
    setIsLoading(true);
    try {
      if (menuImage) {
        const formData = new FormData();
        formData.append("files", menuImage as Blob);
        const response = await fetch(`${config.apiBaseUrl}/assets`, {
          method: "POST",
          body: formData,
        });
        const responseJSON = await response.json();
        const assetUrl = responseJSON.assetUrl;
        menu.assetUrl = assetUrl;
      }
      const response = await fetch(`${config.apiBaseUrl}/menus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menu),
      });
      const menuCreated = await response.json();
      dispatch(addMenu(menuCreated));
      dispatch(fetchMenusMenuCategoriesLocations(selectedLocationId));
      setIsLoading(false);
      setOpen(false);
    } catch (err) {
      setOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle fontSize={30} align="center">
        Create new menu
      </DialogTitle>
      <DialogContent>
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 350,
              margin: "0 auto",
            }}
          >
            <TextField
              label="Name"
              variant="outlined"
              sx={{ my: 2 }}
              onChange={(evt) => setMenu({ ...menu, name: evt.target.value })}
            />
            <TextField
              label="Price"
              variant="outlined"
              type="number"
              sx={{ mb: 2 }}
              onChange={(evt) =>
                setMenu({ ...menu, price: parseInt(evt.target.value, 10) })
              }
            />
            <TextField
              label="Description"
              variant="outlined"
              sx={{ mb: 2 }}
              onChange={(evt) =>
                setMenu({ ...menu, description: evt.target.value })
              }
            />
            <FormControl>
              <InputLabel id="select-menu-categories">
                Menu categories
              </InputLabel>
              <Select
                label="Menu category"
                multiple
                value={selectedMenuCategoryIds}
                onChange={(evt) => {
                  const values = evt.target.value as number[];
                  setSelectedMenuCategoryIds(values);
                  setMenu({ ...menu, menuCategoryIds: values });
                }}
                input={<OutlinedInput label="Menu categories" />}
                renderValue={(values) => {
                  const selectedMenuCategories = selectedMenuCategoryIds.map(
                    (selectedMenuCategoryId) => {
                      return menuCategories.find(
                        (menuCategory) =>
                          menuCategory.id === selectedMenuCategoryId
                      );
                    }
                  );
                  return selectedMenuCategories
                    .map(
                      (selectedMenuCategory) =>
                        selectedMenuCategory && selectedMenuCategory.name
                    )
                    .join(", ");
                }}
              >
                {menuCategories.map((menuCategory) => (
                  <MenuItem key={menuCategory.id} value={menuCategory.id}>
                    <Checkbox
                      checked={
                        menuCategory.id &&
                        selectedMenuCategoryIds.includes(menuCategory.id)
                          ? true
                          : false
                      }
                    />
                    <ListItemText primary={menuCategory.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ mt: 2 }}>
              <FileDropZone onFileSelected={onFileSelected} />
              {menuImage && (
                <Chip
                  sx={{ mt: 2 }}
                  label={menuImage.name}
                  onDelete={() => setMenuImage(undefined)}
                />
              )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <LoadingButton
                loading={isLoading}
                variant="contained"
                onClick={createNewMenu}
                disabled={isDisabled}
                sx={{ mt: 2, width: "fit-content" }}
              >
                Create Menu
              </LoadingButton>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default NewMenu;
