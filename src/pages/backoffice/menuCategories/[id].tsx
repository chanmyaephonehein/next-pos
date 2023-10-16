import DeleteDialog from "@/components/DeleteDialog";
import Loading from "@/components/Loading";
import MenuCard from "@/components/MenuCard";
import { config } from "@/config";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appData } from "@/store/slices/appSlice";
import {
  removeMenuCategory,
  updateMenuCategory,
} from "@/store/slices/menuCategoriesSlice";
import { fetchMenusMenuCategoriesLocations } from "@/store/slices/menusMenuCategoriesLocationsSlice";
import {
  getLocationsByMenuCategoryId,
  getMenusByMenuCategoryId,
  getSelectedLocationId,
} from "@/utils/client";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  TextField,
  Typography,
} from "@mui/material";
import {
  Locations as Location,
  Menus as Menu,
  MenuCategories as MenuCategory,
} from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import RemoveMenuFromMenuCategory from "./RemoveMenuFromMenuCategory";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const EditMenuCategory = () => {
  const router = useRouter();
  const {
    isLoading,
    locations,
    menus,
    menusMenuCategoriesLocations,
    menuCategories,
  } = useAppSelector(appData);
  const menuCategoryId = router.query.id as string;
  const selectedLocationId = getSelectedLocationId() as string;
  const menuCategory = menuCategories.find(
    (item) => item.id === Number(menuCategoryId)
  ) as MenuCategory;
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeletedialog] = useState(false);
  const [selectedMenuToRemove, setSelectedMenuToRemove] = useState<Menu>();
  const validMenus = getMenusByMenuCategoryId(
    menus,
    menuCategoryId,
    menusMenuCategoriesLocations,
    selectedLocationId
  );
  const validMenuIds = validMenus.map((item) => item.id);
  const selectedLocations = getLocationsByMenuCategoryId(
    locations,
    menuCategoryId,
    menusMenuCategoriesLocations
  );
  const [updateMenuCategoryName, setUpdateMenuCategoryName] = useState("");
  const [updateSelectedLocations, setUpdateSelectedLocations] = useState<
    Location[]
  >([]);
  const dispatch = useAppDispatch();

  const [selectedMenu, setSelectedMenu] = useState<Menu>();

  const handleUpdateMenuCategory = async () => {
    const response = await fetch(`${config.apiBaseUrl}/menuCategories`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: menuCategory?.id,
        name: updateMenuCategoryName || menuCategory?.name,
        locationIds: updateSelectedLocations.map((item) => item.id),
      }),
    });
    const menuCategoryUpdated = await response.json();
    dispatch(updateMenuCategory(menuCategoryUpdated));
    dispatch(fetchMenusMenuCategoriesLocations(selectedLocationId));
  };

  const addMenuToMenuCategory = async () => {
    await fetch(`${config.apiBaseUrl}/menuCategories/addMenu`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        menuCategoryId,
        menuId: selectedMenu && selectedMenu.id,
        locationId: selectedLocationId,
      }),
    });
    dispatch(fetchMenusMenuCategoriesLocations(selectedLocationId));
    setSelectedMenu(undefined);
  };

  const handleRemoveMenu = async (menu: Menu) => {
    await fetch(`${config.apiBaseUrl}/menuCategories/removeMenu`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        menuCategoryId,
        menuId: menu.id,
        locationId: selectedLocationId,
      }),
    });
    dispatch(fetchMenusMenuCategoriesLocations(selectedLocationId));
    setOpen(false);
  };

  const handleDeleteMenuCategory = async () => {
    await fetch(`${config.apiBaseUrl}/menuCategories?id=${menuCategoryId}`, {
      method: "DELETE",
    });
    dispatch(removeMenuCategory(menuCategory));
    dispatch(fetchMenusMenuCategoriesLocations(selectedLocationId));
    router.push("/backoffice/menuCategories");
  };

  if (isLoading) return <Loading />;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          color="error"
          variant="contained"
          startIcon={<DeleteIcon />}
          onClick={() => setOpenDeletedialog(true)}
        >
          Delete
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TextField
          defaultValue={menuCategory?.name}
          sx={{ mb: 2 }}
          onChange={(evt) => setUpdateMenuCategoryName(evt.target.value)}
        />
        <Autocomplete
          multiple
          options={locations}
          defaultValue={selectedLocations}
          disableCloseOnSelect
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.name}
          onChange={(evt, values) => {
            setUpdateSelectedLocations(values);
          }}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.name}
            </li>
          )}
          style={{ width: 500 }}
          renderInput={(params) => <TextField {...params} label="Locations" />}
        />
        <Button
          variant="contained"
          onClick={handleUpdateMenuCategory}
          sx={{ width: "fit-content", mt: 3 }}
        >
          Update
        </Button>
      </Box>
      <Box sx={{ my: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Menus
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Autocomplete
            sx={{ minWidth: 300, mr: 3 }}
            defaultValue={selectedMenu}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            onChange={(evt, value) => {
              if (value) setSelectedMenu(value);
            }}
            clearOnBlur
            options={menus.filter((item) => !validMenuIds.includes(item.id))}
            renderInput={(params) => (
              <TextField {...params} label="Add menu to this category" />
            )}
          />
          <Button variant="contained" onClick={addMenuToMenuCategory}>
            Add
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          {validMenus.map((item) => (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <MenuCard menu={item} href={`/backoffice/menus/${item.id}`} />
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                sx={{ width: "fit-content" }}
                onClick={() => {
                  setSelectedMenuToRemove(item);
                  setOpen(true);
                }}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
      <RemoveMenuFromMenuCategory
        menu={selectedMenuToRemove}
        open={open}
        setOpen={setOpen}
        handleRemoveMenu={handleRemoveMenu}
      />
      <DeleteDialog
        title="Are you sure you want to delete this menu category?"
        open={openDeleteDialog}
        setOpen={setOpenDeletedialog}
        callback={handleDeleteMenuCategory}
      />
    </Box>
  );
};

export default EditMenuCategory;
