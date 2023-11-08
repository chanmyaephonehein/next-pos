import DeleteDialog from "@/components/DeleteDialog";
import Loading from "@/components/Loading";
import { config } from "@/config";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appData } from "@/store/slices/appSlice";
import { removeTable, updateTable } from "@/store/slices/tablesSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, TextField } from "@mui/material";
import { Tables as Table } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";

const EditTable = () => {
  const router = useRouter();
  const tableId = router.query.id as string;
  const [open, setOpen] = useState(false);
  const { isLoading, tables } = useAppSelector(appData);
  const dispatch = useAppDispatch();
  const table = tables.find((table) => table.id === Number(tableId)) as Table;
  const [tableName, setTableName] = useState(table?.name);

  const handleUpdateTable = async () => {
    const response = await fetch(`${config.apiBaseUrl}/tables`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tableId, name: tableName }),
    });
    const tableUpdated = await response.json();
    dispatch(updateTable(tableUpdated));
    router.push({ pathname: "/backoffice/tables" });
  };

  const handleDeleteTable = async () => {
    await fetch(`${config.apiBaseUrl}/tables?id=${table?.id}`, {
      method: "DELETE",
    });
    dispatch(removeTable(table));
    router.push("/backoffice/tables");
  };

  if (isLoading) return <Loading />;
  if (!table) return null;

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
          defaultValue={table.name}
          sx={{ mb: 2 }}
          onChange={(evt) => setTableName(evt.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleUpdateTable}
          sx={{ width: "fit-content", mt: 3 }}
        >
          Update
        </Button>
      </Box>
      <DeleteDialog
        title="Are you sure you want to delete this menu?"
        open={open}
        setOpen={setOpen}
        callback={handleDeleteTable}
      />
    </Box>
  );
};

export default EditTable;
