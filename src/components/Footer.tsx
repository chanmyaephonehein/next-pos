import { Box, Typography } from "@mui/material";
import Image from "next/image";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <Box
      sx={{
        height: 150,
        bgcolor: "#4C4C6D",
        px: "12px",
      }}
    >
      <Box
        sx={{
          maxWidth: 1280,
          m: "0 auto",
          display: "flex",
          height: "100%",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography sx={{ color: "#E8F6EF", fontStyle: "italic" }}>
              Hintada Street 39 <br />
              Sanchaung, Yangon <br />
              contact@foodiepos.com
              <br />
              +95 123 456 79
            </Typography>
          </Box>
          <Box sx={{ width: "150px", position: "relative", mt: 2 }}>
            <Image
              alt="logo"
              src={logo}
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
          <Box>
            <Typography sx={{ color: "#E8F6EF", fontStyle: "italic" }}>
              Order app
              <br /> Backoffice app
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
