import { z } from "zod";

export type ContextType = {
  addIssue: (issue: {
    code: z.ZodIssueCode;
    message: string;
    path: string[];
  }) => void;
};

const validateIfSamePort = (
  values: { portOfDischarge: string; portOfLoading: string },
  context: ContextType
): void => {
  if (values.portOfDischarge === values.portOfLoading) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Port of discharge and port of loading cannot be the same",
      path: ["portOfDischarge"],
    });
  }
  if (values.portOfLoading === "") {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify a departure port",
      path: ["portOfLoading"],
    });
  }

  if (values.portOfDischarge === "") {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify an arrival port",
      path: ["portOfDischarge"],
    });
  }
};

const validateArrivalBeforeDeparture = (values: { scheduledArrival: string; scheduledDeparture: string }, context: ContextType) => {
  const { scheduledArrival, scheduledDeparture } = values;
  if (scheduledArrival > scheduledDeparture) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Arrival date cannot be before departure date",
      path: ["scheduledArrival"],
    });
  }
};

export { validateIfSamePort, validateArrivalBeforeDeparture };
