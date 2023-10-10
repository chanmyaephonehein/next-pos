import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import logo from "../assets/logo.png";

const TopBar = () => {
  const { data } = useSession();
  const router = useRouter();
  const getTitle = () => {
    const pathname = router.pathname;
    if (pathname.includes("orders")) return "Orders";
    if (pathname.includes("menuCategories")) return "Menu Categories";
    if (pathname.includes("menus")) return "Menus";
    if (pathname.includes("addonCategories")) return "Adddon Categories";
    if (pathname.includes("addons")) return "Addons";
    if (pathname.includes("tables")) return "Tables";
    if (pathname.includes("locations")) return "Locations";
    if (pathname.includes("settings")) return "Settings";
    return "";
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: "#1B9C85" }}>
          {data ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box
                sx={{
                  width: "150px",
                  display: "flex",
                  position: "relative",
                  mt: 2,
                  alignItems: "center",
                }}
              >
                <Image
                  alt="logo"
                  src={logo}
                  style={{ width: "100%", height: "100%" }}
                />
              </Box>
              <Typography variant="h5">{getTitle()}</Typography>
              <Button
                variant="text"
                size="large"
                onClick={() => signOut({ callbackUrl: "/backoffice" })}
                sx={{ color: "#E8F6EF" }}
              >
                Sign out
              </Button>
            </Box>
          ) : (
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, textAlign: "center" }}
            >
              Foodie POS
            </Typography>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default TopBar;
