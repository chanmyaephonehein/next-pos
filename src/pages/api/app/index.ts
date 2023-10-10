import { prisma } from "@/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) return res.status(400).send("Unauthorized");
  const user = session.user;
  const email = user?.email as string;
  const name = user?.name as string;
  const userFromDB = await prisma.users.findFirst({ where: { email } });
  if (!userFromDB) {
    const newCompany = await prisma.companies.create({
      data: {
        name: "Default company",
        address: "default address",
      },
    });
    await prisma.users.create({
      data: {
        name,
        email,
        assetUrl: "",
        companyId: newCompany.id,
      },
    });
    const newLocation = await prisma.locations.create({
      data: {
        name: "Default location",
        address: "Default address",
        companyId: newCompany.id,
      },
    });
    const newMenusData = [
      { name: "mote-hin-khar", price: 1000 },
      { name: "shan-noodle", price: 1000 },
    ];
    const newMenu = await prisma.$transaction(
      newMenusData.map((menu) => prisma.menus.create({ data: menu }))
    );
    const newMenuCategoriesData = [
      { name: "Default Category 1" },
      { name: "Default Category 2" },
    ];
    const newMenuCategory = await prisma.$transaction(
      newMenuCategoriesData.map((menuCategories) =>
        prisma.menuCategories.create({ data: menuCategories })
      )
    );
    const newMenusMenuCategoriesLocationsData = [
      {
        menuId: newMenu[0].id,
        menuCategoryId: newMenuCategory[0].id,
        locationId: newLocation.id,
      },
      {
        menuId: newMenu[1].id,
        menuCategoryId: newMenuCategory[1].id,
        locationId: newLocation.id,
      },
    ];
    const newMenusMenuCategoriesLocations = await prisma.$transaction(
      newMenusMenuCategoriesLocationsData.map((item) =>
        prisma.menusMenuCategoriesLocations.create({ data: item })
      )
    );
    const newAddonCategoriesData = [{ name: "Drinks" }, { name: "Sizes" }];
    const newAddonCategory = await prisma.$transaction(
      newAddonCategoriesData.map((addonCategory) =>
        prisma.addonCategories.create({ data: addonCategory })
      )
    );
    await prisma.menusAddonCategories.createMany({
      data: [
        {
          menuId: newMenu[0].id,
          addonCategoryId: newAddonCategory[0].id,
        },
        {
          menuId: newMenu[1].id,
          addonCategoryId: newAddonCategory[1].id,
        },
      ],
    });
    const newAddonsData = [
      {
        name: "Cola",
        price: 500,
        addonCategoryId: newAddonCategory[0].id,
      },
      {
        name: "Pepsi",
        price: 500,
        addonCategoryId: newAddonCategory[0].id,
      },
      {
        name: "Large",
        price: 200,
        addonCategoryId: newAddonCategory[1].id,
      },
      {
        name: "Normal",
        price: 0,
        addonCategoryId: newAddonCategory[1].id,
      },
    ];
    const newAddons = await prisma.$transaction(
      newAddonsData.map((addon) => prisma.addons.create({ data: addon }))
    );
    return res.send({
      menus: newMenu,
      menuCategories: newMenuCategory,
      addons: newAddons,
      addonCategories: newAddonCategory,
      locations: newLocation,
      menusMenuCategoriesLocation: newMenusMenuCategoriesLocations,
      company: newCompany,
    });
  } else {
    const companyId = userFromDB.companyId as number;
    const locations = await prisma.locations.findMany({
      where: {
        companyId: companyId,
        isArchived: false,
      },
    });
    const locationIds = locations.map((location) => location.id);
    const menusMenuCategoriesLocations =
      await prisma.menusMenuCategoriesLocations.findMany({
        where: {
          locationId: {
            in: locationIds,
          },
          isArchived: false,
        },
      });
    const menuCategoryIds = menusMenuCategoriesLocations.map(
      (item) => item.menuCategoryId
    );
    const menuIds = menusMenuCategoriesLocations
      .map((item) => item.menuId)
      .filter((item) => item !== null) as number[];
    const menuCategories = await prisma.menuCategories.findMany({
      where: {
        id: {
          in: menuCategoryIds,
        },
        isArchived: false,
      },
    });

    const menus = await prisma.menus.findMany({
      where: {
        id: {
          in: menuIds,
        },
        isArchived: false,
      },
    });
    const menusAddonCategories = await prisma.menusAddonCategories.findMany({
      where: {
        menuId: {
          in: menuIds,
        },
      },
    });

    const addonCategoryIds = menusAddonCategories.map(
      (menuAddonCategoryId) => menuAddonCategoryId.addonCategoryId
    ) as number[];
    const addonCategories = await prisma.addonCategories.findMany({
      where: {
        id: {
          in: addonCategoryIds,
        },
        isArchived: false,
      },
    });
    const addons = await prisma.addons.findMany({
      where: {
        addonCategoryId: {
          in: addonCategoryIds,
        },
        isArchived: false,
      },
    });
    const tables = await prisma.tables.findMany({
      where: {
        locationId: {
          in: locationIds,
        },
        isArchived: false,
      },
    });
    const company = await prisma.companies.findFirst({
      where: {
        id: companyId,
      },
    });
    const orders = await prisma.orders.findMany({
      where: { locationId: { in: locationIds } },
    });
    const orderIds = orders.map((item) => item.id);
    const orderlines = await prisma.orderlines.findMany({
      where: { orderId: { in: orderIds } },
    });
    res.send({
      menus,
      menuCategories,
      addons,
      addonCategories,
      locations,
      menusAddonCategories,
      menusMenuCategoriesLocations,
      company,
      tables,
      orders,
      orderlines,
    });
  }
}
