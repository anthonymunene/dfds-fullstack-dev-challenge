import type { Vessel } from "@prisma/client";
import type { NextApiHandler, NextApiResponse } from "next";
import { prisma } from "~/server/db";
import { excludeFields } from "prisma/utils";

export type VesselReturnType = Pick<Vessel, "id" | "name">[];

const handler: NextApiHandler = async (
  _,
  res: NextApiResponse<VesselReturnType>
) => {
  const vessels = await prisma.vessel.findMany({
    select: excludeFields("Vessel", ["createdAt", "updatedAt"]),
  });

  res.status(200).json(vessels);
};

export default handler;
