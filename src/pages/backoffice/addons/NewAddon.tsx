import { config } from "@/config";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addAddon } from "@/store/slices/addonsSlice";
import { appData } from "@/store/slices/appSlice";
import { addLocation } from "@/store/slices/locationsSlice";
import { addTable } from "@/store/slices/tablesSlice";
import { getSelectedLocationId } from "@/utils/client";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useState } from "react";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const NewAddon = ({ open, setOpen }: Props) => {
  const { addonCategories } = useAppSelector(appData);
  const [newAddon, setNewAddon] = useState({
    name: "",
    price: 0,
    addonCategoryId: "",
  });
  const dispatch = useAppDispatch();

  const createNewAddon = async () => {
    const isValid = newAddon.name && newAddon.addonCategoryId;
    if (!isValid)
      return alert("Please enter addon name and select one addon category");
    const response = await fetch(`${config.apiBaseUrl}/addons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAddon),
    });
    const addonCreated = await response.json();
    dispatch(addAddon(addonCreated));
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Create new addon</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          minWidth: 300,
        }}
      >
        <TextField
          label="Name"
          variant="outlined"
          sx={{ mt: 1 }}
          onChange={(evt) =>
            setNewAddon({
              ...newAddon,
              name: evt.target.value,
            })
          }
        />
        <TextField
          label="Price"
          variant="outlined"
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          sx={{ my: 2 }}
          onChange={(evt) =>
            setNewAddon({
              ...newAddon,
              price: Number(evt.target.value),
            })
          }
        />
        <FormControl fullWidth>
          <InputLabel>Addon Category</InputLabel>
          <Select
            value={newAddon.addonCategoryId}
            label="Addon Category"
            onChange={(evt) =>
              setNewAddon({ ...newAddon, addonCategoryId: evt.target.value })
            }
          >
            {addonCategories.map((item) => {
              return (
                <MenuItem value={item.id} key={item.id}>
                  {item.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={createNewAddon}
          sx={{ width: "fit-content", alignSelf: "flex-end", mt: 2 }}
        >
          Create
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default NewAddon;
