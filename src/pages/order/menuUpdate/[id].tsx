import AddonCategories from "@/components/AddonCategories";
import QuantitySelector from "@/components/QuantitySelector";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appData } from "@/store/slices/appSlice";
import { selectCart, updateCart } from "@/store/slices/cartSlice";
import { getAddonCategoriesByMenuId } from "@/utils/client";
import { Box, Button } from "@mui/material";
import {
  Addons as Addon,
  AddonCategories as AddonCategory,
} from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const MenuUpdate = () => {
  const router = useRouter();
  const query = router.query;
  const dispatch = useAppDispatch();
  const { addons, addonCategories, menusAddonCategories } =
    useAppSelector(appData);
  const { items } = useAppSelector(selectCart);
  const cartItemId = router.query.id as string;
  const cartItem = items.find((item) => item.id === cartItemId);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const validAddonCategories = cartItem
    ? getAddonCategoriesByMenuId(
        addonCategories,
        String(cartItem?.menu.id),
        menusAddonCategories
      )
    : [];
  const validAddonCategoryIds = validAddonCategories.map((item) => item.id);
  const validAddons = addons.filter((item) =>
    validAddonCategoryIds.includes(item.addonCategoryId)
  );

  const handleUpdateCart = () => {
    if (!cartItem) return;
    dispatch(
      updateCart({
        id: cartItemId,
        menu: cartItem.menu,
        addons: selectedAddons,
        quantity,
      })
    );
    router.push({ pathname: "/order/cart", query });
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

  useEffect(() => {
    if (cartItem) {
      const selectedAddon = items.find(
        (item) => item.menu.id === cartItem.menu.id
      )?.addons as Addon[];
      setSelectedAddons(selectedAddon);
      setQuantity(cartItem.quantity);
    }
  }, [cartItem, items]);

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
          src={cartItem?.menu?.assetUrl || ""}
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
            onClick={handleUpdateCart}
            sx={{
              width: "fit-content",
              mt: 3,
            }}
          >
            Update cart
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
export default MenuUpdate;
