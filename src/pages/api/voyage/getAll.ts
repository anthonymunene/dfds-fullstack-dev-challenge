import type { Vessel, Voyage, UnitType } from "@prisma/client";
import type { NextApiHandler, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export type VoyageReturnType = (Voyage & { vessel: Vessel, voyageUnitType: UnitType[] })[];

const handler: NextApiHandler = async (
  _,
  res: NextApiResponse<VoyageReturnType>
) => {
  const voyages = await prisma.voyage.findMany({
    include: {
      vessel: true,
      voyageUnitType: {
        select: { unitType: true },
      },
    },
  });

  const sanitizedVoyages = voyages.map((voyage) => {
    const { vessel, voyageUnitType, ...rest } = voyage;
    const unitTypes = voyageUnitType.map((vut) => vut.unitType);

    return {
      ...rest,
      vessel,
      voyageUnitType: unitTypes,
    };
  })

  res.status(200).json(sanitizedVoyages);
};

export default handler;
