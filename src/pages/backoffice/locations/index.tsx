import ItemCard from "@/components/ItemCard";
import Loading from "@/components/Loading";
import { config } from "@/config";
import { useAppSelector } from "@/store/hooks";
import { appData } from "@/store/slices/appSlice";
import AddIcon from "@mui/icons-material/Add";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, Button } from "@mui/material";
import { Locations as Location } from "@prisma/client";
import { useEffect, useState } from "react";
import NewLocation from "./NewLocation";

const Locations = () => {
  const { isLoading, locations } = useAppSelector(appData);
  const [open, setOpen] = useState(false);
  const [updatedLocations, setUpdateLocations] =
    useState<Location[]>(locations);

  useEffect(() => {
    setUpdateLocations(locations);
  }, [locations]);

  const updateLocation = async (location: Location) => {
    const locationId = location.id;
    const oldLocation = locations.find((loc) => loc.id === locationId);
    const newLocation = updatedLocations.find(
      (updateLocation) => updateLocation.id === locationId
    );
    if (
      oldLocation?.name !== newLocation?.name ||
      oldLocation?.address !== newLocation?.address
    ) {
      await fetch(`${config.apiBaseUrl}/locations`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(location),
      });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <Box>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={() => setOpen(true)}
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "#4C4C6D",
              width: "fit-content",
              color: "#E8F6EF",
              mb: 2,
              ":hover": {
                bgcolor: "#1B9C85", // theme.palette.primary.main
                color: "white",
              },
            }}
          >
            New menu location
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        {locations.map((location) => (
          <ItemCard
            icon={
              <LocationOnIcon
                sx={{ fontSize: "60px", mb: 1.5, color: "#1B9C85" }}
              />
            }
            key={location.id}
            href={`/backoffice/locations/${location.id}`}
            title={location.name}
          />
        ))}
      </Box>
      <NewLocation open={open} setOpen={setOpen} />
    </Box>
  );
};

export default Locations;
