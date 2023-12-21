import type { UnitType } from "@prisma/client";
import type { NextApiHandler, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import { excludeFields } from "prisma/utils";

export type UnitTypeReturnType = Pick<UnitType, "id" | "name" | "defaultLength">[];

const handler: NextApiHandler = async (
  _,
  res: NextApiResponse<UnitTypeReturnType>
) => {
  const unitTypes = await prisma.unitType.findMany({
    select: excludeFields("UnitType", ["createdAt", "updatedAt"]),
  });

  res.status(200).json(unitTypes);
};

export default handler;
