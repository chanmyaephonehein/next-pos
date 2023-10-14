import DeleteDialog from "@/components/DeleteDialog";
import Loading from "@/components/Loading";
import { config } from "@/config";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeAddon, updateAddon } from "@/store/slices/addonsSlice";
import { appData } from "@/store/slices/appSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, TextField } from "@mui/material";
import { Addons as Addon } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const EditAddon = () => {
  const router = useRouter();
  const addonId = router.query.id as string;
  const [open, setOpen] = useState(false);
  const { isLoading, addons } = useAppSelector(appData);
  const [addon, setAddon] = useState<Addon>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (addons.length) {
      const validAddon = addons.find((addon) => addon.id === Number(addonId));
      setAddon(validAddon);
    }
  }, [addons]);

  const handleUpdateAddon = async () => {
    const isValid = addon && addon.name;
    if (!isValid) return alert("Addon name is required.");
    const response = await fetch(`${config.apiBaseUrl}/addons`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addon),
    });
    const addonUpdated = await response.json();
    dispatch(updateAddon(addonUpdated));
  };

  const handleDeleteAddon = async () => {
    await fetch(`${config.apiBaseUrl}/addons?id=${addonId}`, {
      method: "DELETE",
    });
    addon && dispatch(removeAddon(addon));
    router.push("/backoffice/addons");
  };

  if (isLoading) return <Loading />;
  if (!addon) return null;

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
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <TextField
          defaultValue={addon?.name}
          sx={{ mb: 2 }}
          onChange={(evt) => setAddon({ ...addon, name: evt.target.value })}
        />
        <TextField
          type="number"
          defaultValue={addon.price}
          sx={{ mb: 2 }}
          onChange={(evt) =>
            setAddon({ ...addon, price: Number(evt.target.value) })
          }
        />
        <Button
          variant="contained"
          onClick={handleUpdateAddon}
          sx={{ width: "fit-content", mt: 3 }}
        >
          Update
        </Button>
      </Box>
      <DeleteDialog
        title="Are you sure you want to delete this addon?"
        open={open}
        setOpen={setOpen}
        callback={handleDeleteAddon}
      />
    </Box>
  );
};

export default EditAddon;
