// layout.tsx

import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  const { data } = useSession();
  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h4">Foodie App</Typography>
          </Box>
          <span />
          {data && (
            <Button
              color="inherit"
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
            >
              Sign out
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {children}
    </Box>
  );
};

export default Layout;
