import AddonCategories from "@/components/AddonCategories";
import QuantitySelector from "@/components/QuantitySelector";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appData } from "@/store/slices/appSlice";
import { CartItem, addToCart } from "@/store/slices/cartSlice";
import { generateRandomId, getAddonCategoriesByMenuId } from "@/utils/client";
import { Box, Button } from "@mui/material";
import {
  Addons as Addon,
  AddonCategories as AddonCategory,
} from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Menu = () => {
  const router = useRouter();
  const query = router.query;
  const dispatch = useAppDispatch();
  const { menus, addons, addonCategories, menusAddonCategories } =
    useAppSelector(appData);
  const { isLoading } = useAppSelector((state) => state.app);
  const menuId = router.query.id as string;
  const menu = menus.find((item) => item.id === Number(menuId));
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const validAddonCategories = getAddonCategoriesByMenuId(
    addonCategories,
    menuId,
    menusAddonCategories
  );
  const validAddonCategoryIds = validAddonCategories.map((item) => item.id);
  const validAddons = addons.filter((item) =>
    validAddonCategoryIds.includes(item.addonCategoryId)
  );

  useEffect(() => {
    const requiredAddonCategories = validAddonCategories.filter(
      (item) => item.isRequired
    );
    if (requiredAddonCategories.length) {
      if (!selectedAddons.length) {
        setIsDisabled(true);
      } else {
        const requiredAddons = selectedAddons.filter((item) => {
          const addonCategory = validAddonCategories.find(
            (validAddonCategory) =>
              validAddonCategory.id === item.addonCategoryId
          );
          if (addonCategory?.isRequired) {
            return true;
          }
          return false;
        });
        const hasSelectedAllRequiredAddons =
          requiredAddonCategories.length === requiredAddons.length;
        const isDisabled = hasSelectedAllRequiredAddons ? false : true;
        setIsDisabled(isDisabled);
      }
    }
  }, [selectedAddons, validAddonCategories]);

  const handleAddToCart = () => {
    if (!menu) return;
    const cartItem: CartItem = {
      id: generateRandomId(),
      menu,
      quantity,
      addons: selectedAddons,
    };
    dispatch(addToCart(cartItem));
    router.push({ pathname: "/order", query });
  };

  const handleAddonSelect = (selected: boolean, addon: Addon) => {
    const addonCategory = addonCategories.find(
      (item) => item.id === addon.addonCategoryId
    ) as AddonCategory;
    if (addonCategory.isRequired) {
      const addonWtihSameAddonCategory = selectedAddons.find(
        (item) => item.addonCategoryId === addon.addonCategoryId
      );
      let newSelectedAddons: Addon[] = [];
      if (addonWtihSameAddonCategory) {
        const filteredAddons = selectedAddons.filter(
          (item) => item.id !== addonWtihSameAddonCategory.id
        );
        newSelectedAddons = [...filteredAddons, addon];
      } else {
        newSelectedAddons = [...selectedAddons, addon];
      }
      setSelectedAddons(newSelectedAddons);
    } else {
      if (selected) {
        setSelectedAddons([...selectedAddons, addon]);
      } else {
        setSelectedAddons([
          ...selectedAddons.filter(
            (selectedAddon) => selectedAddon.id !== addon.id
          ),
        ]);
      }
    }
  };

  const handleQuantityDecrease = () => {
    const newValue = quantity - 1 === 0 ? 1 : quantity - 1;
    setQuantity(newValue);
  };

  const handleQuantityIncrease = () => {
    const newValue = quantity + 1;
    setQuantity(newValue);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          p: 4,
        }}
      >
        <Image
          src={menu?.assetUrl || ""}
          alt="menu-image"
          width={150}
          height={150}
          style={{
            borderRadius: "50%",
            margin: "0 auto",
          }}
        />
        <Box
          sx={{
            mt: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <AddonCategories
            validAddonCategories={validAddonCategories}
            validAddons={validAddons}
            selectedAddons={selectedAddons}
            onChange={(checked, item) => handleAddonSelect(checked, item)}
          />
          <QuantitySelector
            value={quantity}
            onDecrease={handleQuantityDecrease}
            onIncrease={handleQuantityIncrease}
          />
          <Button
            variant="contained"
            disabled={isDisabled}
            onClick={handleAddToCart}
            sx={{
              width: "fit-content",
              mt: 3,
            }}
          >
            Add to cart
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
export default Menu;
