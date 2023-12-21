import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import Head from "next/head";
import Layout from "~/components/layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { UnitTypes } from "~/components/ui/views/unitType";
import { toast } from "~/components/ui/use-toast";

import { fetchData } from "~/utils";
import type { VoyageReturnType } from "./api/voyage/getAll";

import { Button } from "~/components/ui/button";
import { TABLE_DATE_FORMAT } from "~/constants";

import { VoyageForm } from "~/components/ui/form/voyage";
import type { VoyageCustomValidators } from "~/prismaTypes";

export default function Home() {
  const { data: voyages } = useQuery<VoyageReturnType>(["voyages"], () =>
    fetchData("voyage/getAll")
  );

  const queryClient = useQueryClient();
  const onDelete = useMutation(deleteVoyage, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(["voyages"]);
    },
  });

  const onAdd = useMutation(addVoyage, {
    onSuccess: async () => {
      toast({
        title: "Success!",
        description: (
          <pre className="w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">Voyage has been added</code>
          </pre>
        ),
      });
      await queryClient.invalidateQueries(["voyages"]);
    },
  });

  const handleCreate = (data: VoyageCustomValidators) => {
    onAdd.mutate(data);
  };
  const handleDelete = (voyageId: string) => {
    onDelete.mutate(voyageId);
  };

  return (
    <>
      <Head>
        <title>Voyages | DFDS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>
                  <VoyageForm handleSubmit={handleCreate} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Departure</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Port of loading</TableHead>
              <TableHead>Port of discharge</TableHead>
              <TableHead>Vessel</TableHead>
              <TableHead>Unit types</TableHead>
              <TableHead>&nbsp;</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {voyages?.map((voyage) => (
              <TableRow key={voyage.id}>
                <TableCell>
                  {format(
                    new Date(voyage.scheduledDeparture),
                    TABLE_DATE_FORMAT
                  )}
                </TableCell>
                <TableCell>
                  {format(new Date(voyage.scheduledArrival), TABLE_DATE_FORMAT)}
                </TableCell>
                <TableCell>{voyage.portOfLoading}</TableCell>
                <TableCell>{voyage.portOfDischarge}</TableCell>
                <TableCell>{voyage.vessel.name}</TableCell>
                <TableCell>
                  <UnitTypes unitTypes={voyage.voyageUnitType} />
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDelete(voyage.id)}
                    variant="outline"
                  >
                    X
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Layout>
    </>
  );
}

const addVoyage = async (voyage: VoyageCustomValidators) => {
  const response = await fetch(`/api/voyage/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(voyage),
  });

  if (!response.ok) {
    throw new Error("Failed to add the voyage");
  }
};

const deleteVoyage = async (voyageId: string) => {
  const response = await fetch(`/api/voyage/delete?id=${voyageId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    toast({
      title: "Uh oh! Something went wrong",
      description: (
        <pre className="w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            There was a problem with your request
          </code>
        </pre>
      ),
    });
    throw new Error("Failed to delete the voyage");
  }
};
