// pages / backoffice / index.tsx

import Layout from "@/Layout/layout";
import { Box, Button, TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const BackofficeApp = () => {
  const { data, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status]);

  if (status === "unauthenticated") return null;

  const handleCreateNewUser = async () => {
    const isValid = user.name && user.email;
    if (!isValid) return alert("Name and email are required.");
    await fetch("http://localhost:3000/api/backoffice", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(user),
    });
  };

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          maxWidth: 200,
          margin: "0 auto",
          mt: 3,
        }}
      >
        <TextField
          placeholder="Name"
          sx={{ mb: 2 }}
          onChange={(evt) => setUser({ ...user, name: evt.target.value })}
        ></TextField>
        <TextField
          placeholder="email"
          sx={{ mb: 2 }}
          onChange={(evt) => setUser({ ...user, email: evt.target.value })}
        ></TextField>
        <Button
          variant="contained"
          sx={{ width: "fit-content" }}
          onClick={handleCreateNewUser}
        >
          Create new user
        </Button>
      </Box>
    </Layout>
  );
};

export default BackofficeApp;
