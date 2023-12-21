import type {Voyage } from "@prisma/client";
import type { NextApiHandler, NextApiResponse, NextApiRequest } from "next";
import { prisma } from "~/server/db";

export type VoyageReturnType = (Voyage);

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<VoyageReturnType>
) => {
    console.log('request body',req.body);

  const voyage = await prisma.voyage.create({
    data: req.body,
  });
  res.json(voyage);

};

export default handler;
