import DeleteDialog from "@/components/DeleteDialog";
import Loading from "@/components/Loading";
import { config } from "@/config";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appData } from "@/store/slices/appSlice";
import { fetchMenusMenuCategoriesLocations } from "@/store/slices/menusMenuCategoriesLocationsSlice";
import { removeMenu, updateMenu } from "@/store/slices/menusSlice";
import {
  getAddonCategoriesByMenuId,
  getSelectedLocationId,
} from "@/utils/client";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import DeleteIcon from "@mui/icons-material/Delete";
import { Autocomplete, Box, Button, Checkbox, TextField } from "@mui/material";
import {
  AddonCategories as AddonCategory,
  Menus as Menu,
} from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const EditMenu = () => {
  const router = useRouter();
  const menuId = router.query.id as string;
  const { isLoading, menus, addonCategories, menusAddonCategories } =
    useAppSelector(appData);
  const menu = menus.find((menu) => menu.id === Number(menuId)) as Menu;
  const [menuToUpdate, setMenuToUpdate] = useState<Partial<Menu>>();
  const dispatch = useAppDispatch();
  const selectedLocationId = getSelectedLocationId() as string;
  const [open, setOpen] = useState(false);
  const selectedAddonCategories = getAddonCategoriesByMenuId(
    addonCategories,
    menuId,
    menusAddonCategories
  );
  const [updateSelectedAddonCategories, setUpdateSelectedAddonCategories] =
    useState<AddonCategory[]>([]);

  const handleUpdateMenu = async () => {
    const response = await fetch(`${config.apiBaseUrl}/menus`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...menuToUpdate,
        id: menu.id,
        addonCategoryIds: updateSelectedAddonCategories.map((item) => item.id),
      }),
    });
    const menuUpdated = await response.json();
    dispatch(updateMenu(menuUpdated));
    dispatch(fetchMenusMenuCategoriesLocations(selectedLocationId));
  };

  const handleDeleteMenu = async () => {
    await fetch(`${config.apiBaseUrl}/menus?id=${menuId}`, {
      method: "DELETE",
    });
    dispatch(removeMenu(menu));
    dispatch(fetchMenusMenuCategoriesLocations(selectedLocationId));
    router.push("/backoffice/menus");
  };

  if (isLoading) return <Loading />;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          color="error"
          variant="contained"
          startIcon={<DeleteIcon />}
          onClick={() => setOpen(true)}
        >
          Delete
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          margin: "0 auto",
          mt: 5,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            defaultValue={menu?.name}
            sx={{ mb: 2 }}
            onChange={(evt) =>
              setMenuToUpdate({ ...menuToUpdate, name: evt.target.value })
            }
          />
          <TextField
            id="outlined-basic"
            label="Price"
            variant="outlined"
            type="number"
            defaultValue={menu?.price}
            sx={{ mb: 2 }}
            onChange={(evt) =>
              setMenuToUpdate({
                ...menuToUpdate,
                price: Number(evt.target.value),
              })
            }
          />
          <Autocomplete
            multiple
            options={addonCategories}
            defaultValue={selectedAddonCategories}
            disableCloseOnSelect
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => option.name}
            onChange={(evt, values) => {
              setUpdateSelectedAddonCategories(values);
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
            sx={{ mb: 2 }}
            renderInput={(params) => (
              <TextField {...params} label="Addon Categories" />
            )}
          />
          <Button
            variant="contained"
            onClick={handleUpdateMenu}
            sx={{ width: "fit-content" }}
          >
            Update
          </Button>
        </Box>
      </Box>
      <DeleteDialog
        title="Are you sure you want to delete this menu?"
        open={open}
        setOpen={setOpen}
        callback={handleDeleteMenu}
      />
    </Box>
  );
};

export default EditMenu;
