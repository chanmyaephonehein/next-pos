import CategoryIcon from "@mui/icons-material/Category";
import ClassIcon from "@mui/icons-material/Class";
import EggIcon from "@mui/icons-material/Egg";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SettingsIcon from "@mui/icons-material/Settings";
import TableBarIcon from "@mui/icons-material/TableBar";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";

const SideBar = () => {
  return (
    <Box
      sx={{
        minWidth: 250,
        backgroundColor: "#1B9C85",
        borderTopRightRadius: "20px",
        minHeight: "100vh",
      }}
    >
      <List sx={{ p: 0 }}>
        {sidebarMenuItems.slice(0, 7).map((item) => (
          <Link
            key={item.id}
            href={item.route}
            style={{ textDecoration: "none", color: "#313131" }}
          >
            <ListItem
              disablePadding
              sx={{ "&.hover": { backgroundColor: "blue" } }}
            >
              <ListItemButton>
                <ListItemIcon sx={{ color: "#E8F6EF" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} sx={{ color: "#E8F6EF" }} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider variant={"middle"} sx={{ backgroundColor: "#FFE194", mt: 2 }} />
      <List>
        {sidebarMenuItems.slice(-1).map((item) => (
          <Link
            key={item.id}
            href={item.route}
            style={{ textDecoration: "none", color: "#313131" }}
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ color: "#E8F6EF" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} sx={{ color: "#E8F6EF" }} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );
};

export default SideBar;

export const sidebarMenuItems = [
  {
    id: 1,
    label: "Orders",
    icon: <LocalMallIcon />,
    route: "/backoffice/orders",
  },
  {
    id: 3,
    label: "Menu Categories",
    icon: <CategoryIcon />,
    route: "/backoffice/menuCategories",
  },
  {
    id: 2,
    label: "Menus",
    icon: <LocalDiningIcon />,
    route: "/backoffice/menus",
  },
  {
    id: 5,
    label: "Addon Categories",
    icon: <ClassIcon />,
    route: "/backoffice/addonCategories",
  },
  {
    id: 4,
    label: "Addons",
    icon: <EggIcon />,
    route: "/backoffice/addons",
  },
  {
    id: 6,
    label: "Tables",
    icon: <TableBarIcon />,
    route: "/backoffice/tables",
  },
  {
    id: 7,
    label: "Locations",
    icon: <LocationOnIcon />,
    route: "/backoffice/locations",
  },
  {
    id: 8,
    label: "Settings",
    icon: <SettingsIcon />,
    route: "/backoffice/settings",
  },
];
