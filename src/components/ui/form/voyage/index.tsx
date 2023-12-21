"use client";
import React, { useState } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { startOfHour, format, toDate } from "date-fns";
import { cn } from "src/utils";
import { useQuery } from "@tanstack/react-query";
// import type { UnitTypeReturnType } from "~/pages/api/unittypes/getAll";
import type { VesselReturnType } from "~/pages/api/vessel/getAll";
import { fetchData } from "~/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { CalendarIcon } from "@radix-ui/react-icons";

import { Calendar } from "~/components/ui/calendar";

import { Button } from "~/components/ui/button";

import * as z from "zod";

import {
  VoyageCustomValidatorsSchema,
  VoyageWithRelationsSchema,
} from "~/prismaTypes";
import { zodResolver } from "@hookform/resolvers/zod";

const VoyageCustomValidatorsWithRelationsSchema = z.union([
  VoyageCustomValidatorsSchema,
  VoyageWithRelationsSchema,
]);

type VoyageCustomValidatorsWithRelationsSchema = z.infer<
  typeof VoyageCustomValidatorsWithRelationsSchema
>;

export function VoyageForm({
  handleSubmit,
}: {
  handleSubmit: (data: VoyageCustomValidatorsWithRelationsSchema) => void;
}) {
  /**
    TODO:this query would be used to populate all availble unit types when creating a voyage
    this could then be used to populate the unit type datatable allowing the users to add  at least 5 new unit types
      const {
        data: unitTypes,
        isSuccess: isUnitTypesSuccess,
      } = useQuery<UnitTypeReturnType>(["unittypes"], () =>
        fetchData("unittypes/getAll")
      );

   */

  const { data: vessels, isSuccess: isVesselsSuccess } =
    useQuery<VesselReturnType>(["vessels"], () => fetchData("vessel/getAll"));

  const [isOpen, setIsOpen] = useState(false);

  const scheduledDeparture = startOfHour(new Date());
  const scheduledArrival = startOfHour(new Date());
  const initialFormValues = {
    portOfLoading: "",
    portOfDischarge: "",
    vesselId: "",
    scheduledArrival,
    scheduledDeparture,
  };

  const form = useForm<z.infer<typeof VoyageCustomValidatorsSchema>>({
    resolver: zodResolver(VoyageCustomValidatorsSchema),
    defaultValues: initialFormValues,
  });

  function onSubmit(data: z.infer<typeof VoyageCustomValidatorsSchema>) {
    setIsOpen(false);
    handleSubmit(data);
  }

  return (
    <>
      <Sheet
        open={isOpen}
        onOpenChange={(e) => {
          setIsOpen(e);
        }}
        key={"right"}
      >
        <SheetTrigger asChild>
          <Button>Create</Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="md:w-1/2">
          <SheetHeader>
            <SheetTitle>Voyage</SheetTitle>
            <SheetDescription className="mb-4">
              Create a voyage. Click save when you&apos;re done.
            </SheetDescription>
          </SheetHeader>
          <FormProvider {...form}>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void form.handleSubmit(onSubmit)(event);
              }}
              className="space-y-4"
            >
              {isVesselsSuccess && (
                <Form vessels={vessels} />
              )}
            </form>
          </FormProvider>
        </SheetContent>
      </Sheet>
    </>
  );
}

export const Form = ({ vessels }: { vessels: VesselReturnType }) => {
  const { control } = useFormContext();

  
  return (
    <>
      <FormField
        name="portOfLoading"
        control={control}
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormLabel>From</FormLabel>
            <Select onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a port" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Oslo">Oslo</SelectItem>
                <SelectItem value="Copenhagen">Copenhagen</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="portOfDischarge"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormLabel>To</FormLabel>
            <Select onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a port" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Oslo">Oslo</SelectItem>
                <SelectItem value="Copenhagen">Copenhagen</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="vesselId"
        render={({ field }) => (
          <FormItem className="space-y-4">
            <FormLabel>Vessel</FormLabel>
            <Select onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a vessel" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {vessels.map((vessel) => (
                    <SelectItem key={vessel.id} value={vessel.id}>
                      {vessel.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="scheduledArrival"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="w-[240px]">Departure</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="scheduledDeparture"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className="w-[240px]">Arrival</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <FormMessage />
          </FormItem>
        )}
      />
      <Button className="space-y-4" type="submit">
        Submit
      </Button>
    </>
  );
};
