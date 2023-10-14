import Loading from "@/components/Loading";
import { config } from "@/config";
import { useAppSelector } from "@/store/hooks";
import { appData } from "@/store/slices/appSlice";
import { getSelectedLocationId } from "@/utils/client";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { Companies as Company, Locations as Location } from "@prisma/client";
import { useEffect, useState } from "react";

const Settings = () => {
  const { isLoading, company, locations } = useAppSelector(appData);
  const [newCompany, setNewCompany] = useState<Partial<Company>>({
    id: company?.id as number,
    name: company?.name as string,
    address: company?.address as string,
    isArchived: company?.isArchived || false,
  });
  const [selectedLocation, setSelectedLocation] = useState<Location>();

  useEffect(() => {
    if (locations.length) {
      const selectedLocationId = getSelectedLocationId();
      if (!selectedLocationId) {
        localStorage.setItem("selectedLocationId", String(locations[0].id));
        setSelectedLocation(locations[0]);
      } else {
        const selectedLocation = locations.find(
          (location) => String(location.id) === selectedLocationId
        );
        setSelectedLocation(selectedLocation);
      }
    }
    if (company) setNewCompany(company);
  }, [locations, company]);

  const handleOnchange = (evt: SelectChangeEvent<number>) => {
    localStorage.setItem("selectedLocationId", String(evt.target.value));
    const selectedLocation = locations.find(
      (location) => location.id === evt.target.value
    );
    setSelectedLocation(selectedLocation);
  };

  const updateCompany = async () => {
    await fetch(`${config.apiBaseUrl}/companies`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCompany),
    });
  };

  if (isLoading) return <Loading />;
  if (!company) return null;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          margin: "0 auto",
        }}
      >
        <TextField
          label="Name"
          variant="outlined"
          value={newCompany.name}
          sx={{ mb: 2 }}
          onChange={(evt) => {
            const name = evt.target.value;
            setNewCompany({ ...newCompany, name });
          }}
        />
        <TextField
          label="Address"
          variant="outlined"
          value={newCompany.address}
          sx={{ mb: 2 }}
          onChange={(evt) =>
            setNewCompany({ ...newCompany, address: evt.target.value })
          }
        />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Locations</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedLocation ? selectedLocation.id : ""}
            label="Locations"
            onChange={handleOnchange}
          >
            {locations.map((location) => {
              return (
                <MenuItem key={location.id} value={location.id}>
                  {location.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          sx={{ mt: 2, width: "fit-content" }}
          onClick={updateCompany}
        >
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
