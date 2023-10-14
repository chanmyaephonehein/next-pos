import { Box, Button } from "@mui/material";
import { signIn } from "next-auth/react";

const SignIn = () => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Button
        variant="contained"
        onClick={() => signIn("google", { callbackUrl: "/backoffice" })}
      >
        Sign in with Google
      </Button>
    </Box>
  );
};

export default SignIn;
