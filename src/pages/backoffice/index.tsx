import Loading from "@/components/Loading";
import { useAppSelector } from "@/store/hooks";
import { appData } from "@/store/slices/appSlice";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const BackOfficeApp = () => {
  const { isLoading } = useAppSelector(appData);
  const { data, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/backoffice/orders");
    }
    if (status !== "loading" && status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [data, router]);

  if (isLoading) return <Loading />;
  return null;
};

export default BackOfficeApp;
