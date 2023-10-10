import {
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";
import {
  Addons as Addon,
  AddonCategories as AddonCategory,
} from "@prisma/client";

interface Props {
  addonCategory: AddonCategory;
  validAddons: Addon[];
  selectedAddons: Addon[];
  onChange: (checked: boolean, addon: Addon) => void;
}

const Addons = ({
  addonCategory,
  validAddons,
  selectedAddons,
  onChange,
}: Props) => {
  const addons = validAddons.filter(
    (item) => item.addonCategoryId === addonCategory.id
  );
  return (
    <Box>
      {addons.map((item) => {
        return (
          <Box
            key={item.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FormControlLabel
              value={item.name}
              control={
                addonCategory.isRequired ? (
                  <Radio
                    color="success"
                    checked={
                      selectedAddons.find((addon) => addon.id === item.id)
                        ? true
                        : false
                    }
                    onChange={(evt, value) => onChange(value, item)}
                  />
                ) : (
                  <Checkbox
                    color="success"
                    checked={
                      selectedAddons.find((addon) => addon.id === item.id)
                        ? true
                        : false
                    }
                    onChange={(evt, value) => onChange(value, item)}
                  />
                )
              }
              label={item.name}
            />
            <Typography sx={{ fontStyle: "italic" }}>{item.price}</Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default Addons;
