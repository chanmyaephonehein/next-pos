// pages / auth / signin / index.tsx

import Layout from "@/Layout/layout";
import { Box, Button } from "@mui/material";
import { signIn } from "next-auth/react";

const SignIn = () => {
  return (
    <Layout>
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Button
          variant="contained"
          sx={{ width: "fit-content", mt: 2 }}
          onClick={() => signIn("google", { callbackUrl: "/backoffice" })}
        >
          Log in
        </Button>
      </Box>
    </Layout>
  );
};

export default SignIn;
