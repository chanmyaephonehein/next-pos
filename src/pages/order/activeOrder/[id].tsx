import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appData } from "@/store/slices/appSlice";
import { emptyCart } from "@/store/slices/cartSlice";
import { Box, Paper, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ActiveOrder = () => {
  const router = useRouter();
  const { query, isReady } = router;
  const orderId = router.query.id as string;
  const { orders } = useAppSelector(appData);
  const order = orders.find((item) => item.id === Number(orderId));
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isReady && !order) {
      router.push({ pathname: "/order", query });
    }
  }, [isReady, order]);

  useEffect(() => {
    dispatch(emptyCart());
  }, []);

  if (!order) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper sx={{ maxWidth: 500 }}>
        <Typography variant="h5">orderId: {order.id}</Typography>
        <Typography variant="h5">price: {order.price}</Typography>
        <Typography variant="h5">tableId: {order.tableId}</Typography>
      </Paper>
    </Box>
  );
};

export default ActiveOrder;
