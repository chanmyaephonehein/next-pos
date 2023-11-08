import DeleteDialog from "@/components/DeleteDialog";
import Loading from "@/components/Loading";
import { config } from "@/config";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  removeAddonCategory,
  updateAddonCategory,
} from "@/store/slices/addonCategoriesSlice";
import { appData } from "@/store/slices/appSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import { AddonCategories as AddonCategory } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const EditAddonCategories = () => {
  const router = useRouter();
  const addonCategoryId = router.query.id as string;
  const { isLoading, addonCategories } = useAppSelector(appData);
  const [open, setOpen] = useState(false);
  const [addonCategory, setAddonCategory] = useState<AddonCategory>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (addonCategories.length) {
      const addonCategory = addonCategories.find(
        (item) => item.id === Number(addonCategoryId)
      ) as AddonCategory;
      setAddonCategory(addonCategory);
    }
  }, [addonCategories]);

  const handleUpdateAddonCategory = async () => {
    const response = await fetch(`${config.apiBaseUrl}/addonCategories`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addonCategory),
    });
    const addonCategoryUpdated = await response.json();
    dispatch(updateAddonCategory(addonCategoryUpdated));
    router.push({ pathname: "/backoffice/addonCategories" });
  };

  const handleDeleteAddonCategory = async () => {
    await fetch(`${config.apiBaseUrl}/addonCategories?id=${addonCategoryId}`, {
      method: "DELETE",
    });
    addonCategory && dispatch(removeAddonCategory(addonCategory));
    router.push("/backoffice/addonCategories");
  };

  if (isLoading) return <Loading />;
  if (!addonCategory) return null;

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
          defaultValue={addonCategory?.name}
          onChange={(evt) =>
            setAddonCategory({
              ...addonCategory,
              name: evt.target.value,
            })
          }
        />
        <FormControlLabel
          sx={{ my: 2 }}
          control={
            <Switch
              defaultChecked={addonCategory?.isRequired ? true : false}
              onChange={(evt) =>
                setAddonCategory({
                  ...addonCategory,
                  isRequired: evt.target.checked,
                })
              }
            />
          }
          label="required"
        />
        <Button
          variant="contained"
          onClick={handleUpdateAddonCategory}
          sx={{ width: "fit-content", mt: 3 }}
        >
          Update
        </Button>
      </Box>
      <DeleteDialog
        title="Are you sure you want to delete this addon category?"
        open={open}
        setOpen={setOpen}
        callback={handleDeleteAddonCategory}
      />
    </Box>
  );
};

export default EditAddonCategories;
