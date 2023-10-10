import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAppData } from "@/store/slices/appSlice";
import { Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import SideBar from "./SideBar";
import TopBar from "./TopBar";

interface Props {
  title?: string;
  children: string | JSX.Element | JSX.Element[];
}

const BackofficeLayout = (props: Props) => {
  const { data } = useSession();
  const { init } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!init) {
      dispatch(fetchAppData({ locationId: undefined }));
    }
  }, [dispatch, init]);

  return (
    <Box sx={{ bgcolor: "#E8F6EF", minHeight: "100vh" }}>
      <TopBar />
      <Box sx={{ display: "flex", position: "relative", zIndex: 5, flex: 1 }}>
        {data && <SideBar />}
        <Box sx={{ p: 3, width: "100%", height: "100%" }}>{props.children}</Box>
      </Box>
    </Box>
  );
};

export default BackofficeLayout;
