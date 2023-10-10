import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

interface Props {
  title: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  callback: () => void;
}

const DeleteDialog = ({ title, open, setOpen, callback }: Props) => {
  return (
    <Dialog open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">This action cannot be undone.</Typography>
      </DialogContent>
      <DialogActions>
        <Box sx={{ mb: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setOpen(false)}
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              callback();
              setOpen(false);
            }}
          >
            Confirm
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
