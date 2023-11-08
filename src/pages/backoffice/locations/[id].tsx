import DeleteDialog from "@/components/DeleteDialog";
import Loading from "@/components/Loading";
import { config } from "@/config";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appData } from "@/store/slices/appSlice";
import { removeLocation, updateLocation } from "@/store/slices/locationsSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, TextField } from "@mui/material";
import { Locations as Location } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const EditLocation = () => {
  const router = useRouter();
  const locationId = router.query.id as string;
  const [open, setOpen] = useState(false);
  const { isLoading, locations } = useAppSelector(appData);
  const [location, setLocation] = useState<Location>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (locations.length) {
      const validLocation = locations.find(
        (location) => location.id === Number(locationId)
      );
      setLocation(validLocation);
    }
  }, [locations]);

  const handleUpdateLocation = async () => {
    const isValid = location && location.name && location.address;
    if (!isValid) return alert("Name and address are required.");
    const response = await fetch(`${config.apiBaseUrl}/locations`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    });
    const locationUpdated = await response.json();
    dispatch(updateLocation(locationUpdated));
    router.push({ pathname: "/backoffice/locations" });
  };

  const handleDeleteLocation = async () => {
    const locationId = location?.id as number;
    await fetch(`${config.apiBaseUrl}/locations?id=${locationId}`, {
      method: "DELETE",
    });
    location && dispatch(removeLocation(location));
    router.push("/backoffice/locations");
  };

  if (isLoading) return <Loading />;
  if (!location) return null;

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
          defaultValue={location?.name}
          sx={{ mb: 2 }}
          onChange={(evt) =>
            location && setLocation({ ...location, name: evt.target.value })
          }
        />
        <TextField
          defaultValue={location?.address}
          sx={{ mb: 2 }}
          onChange={(evt) =>
            location && setLocation({ ...location, address: evt.target.value })
          }
        />
        <Button
          variant="contained"
          onClick={handleUpdateLocation}
          sx={{ width: "fit-content", mt: 3 }}
        >
          Update
        </Button>
      </Box>
      <DeleteDialog
        title="Are you sure you want to delete this location?"
        open={open}
        setOpen={setOpen}
        callback={handleDeleteLocation}
      />
    </Box>
  );
};

export default EditLocation;
