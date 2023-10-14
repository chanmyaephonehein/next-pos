import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Menus as Menu } from "@prisma/client";

interface Props {
  menu?: Menu;
  open: boolean;
  setOpen: (value: boolean) => void;
  handleRemoveMenu: (menu: Menu) => void;
}

const RemoveMenuFromMenuCategory = ({
  menu,
  open,
  setOpen,
  handleRemoveMenu,
}: Props) => {
  if (!menu) return null;

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Remove menu from menu this category</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to remove the menu from this menu category?
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography>
            Menu that will be removed from this menu category:{" "}
            <b>{menu.name}</b>
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box>
          <Button variant="text" sx={{ mr: 3 }} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => handleRemoveMenu(menu)}>
            Yes
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default RemoveMenuFromMenuCategory;
