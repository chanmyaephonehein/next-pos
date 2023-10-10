import { Box, Chip, Typography } from "@mui/material";
import {
  Addons as Addon,
  AddonCategories as AddonCategory,
} from "@prisma/client";
import Addons from "./Addons";

interface Props {
  validAddonCategories: AddonCategory[];
  validAddons: Addon[];
  selectedAddons: Addon[];
  onChange: (checked: boolean, addon: Addon) => void;
}

const AddonCategories = ({
  validAddonCategories,
  validAddons,
  selectedAddons,
  onChange,
}: Props) => {
  return (
    <Box>
      {validAddonCategories.map((item) => {
        return (
          <Box key={item.id} sx={{ mb: 5 }}>
            <Box
              sx={{
                display: "flex",
                width: "300px",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" sx={{ userSelect: "none" }}>
                {item.name}
              </Typography>
              <Chip label={item.isRequired ? "Required" : "Optional"} />
            </Box>
            <Box sx={{ pl: 1, mt: 2 }}>
              <Addons
                addonCategory={item}
                validAddons={validAddons}
                selectedAddons={selectedAddons}
                onChange={onChange}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default AddonCategories;
