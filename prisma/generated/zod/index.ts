import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { validateIfSamePort, validateArrivalBeforeDeparture } from '../../customImports'

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['Serializable']);

export const VesselScalarFieldEnumSchema = z.enum(['id','name','createdAt','updatedAt']);

export const VoyageScalarFieldEnumSchema = z.enum(['id','portOfLoading','portOfDischarge','vesselId','scheduledDeparture','scheduledArrival','createdAt','updatedAt']);

export const UnitTypeScalarFieldEnumSchema = z.enum(['id','name','defaultLength','createdAt','updatedAt']);

export const VoyageUnitTypeScalarFieldEnumSchema = z.enum(['id','voyageId','unitTypeId','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// VESSEL SCHEMA
/////////////////////////////////////////

export const VesselSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Vessel = z.infer<typeof VesselSchema>

// VESSEL RELATION SCHEMA
//------------------------------------------------------

export type VesselRelations = {
  voyages: VoyageWithRelations[];
};

export type VesselWithRelations = z.infer<typeof VesselSchema> & VesselRelations

export const VesselWithRelationsSchema: z.ZodType<VesselWithRelations> = VesselSchema.merge(z.object({
  voyages: z.lazy(() => VoyageWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// VOYAGE SCHEMA
/////////////////////////////////////////

export const VoyageSchema = z.object({
  // omitted: id: z.string().cuid(),
  portOfLoading: z.string(),
  portOfDischarge: z.string(),
  /**
   * string
   */
  vesselId: z.string().min(5, { message: "Please select a vessel" }),
  scheduledDeparture: z.coerce.date(),
  scheduledArrival: z.coerce.date(),
  // omitted: createdAt: z.coerce.date(),
  // omitted: updatedAt: z.coerce.date(),
})

export type Voyage = z.infer<typeof VoyageSchema>

/////////////////////////////////////////
// VOYAGE CUSTOM VALIDATORS SCHEMA
/////////////////////////////////////////

export const VoyageCustomValidatorsSchema = VoyageSchema.strict().superRefine((val, context) => validateIfSamePort(val, context)).superRefine((val, context) => validateArrivalBeforeDeparture(val, context))

export type VoyageCustomValidators = z.infer<typeof VoyageCustomValidatorsSchema>

// VOYAGE RELATION SCHEMA
//------------------------------------------------------

export type VoyageRelations = {
  vessel: VesselWithRelations;
  voyageUnitType: VoyageUnitTypeWithRelations[];
};

export type VoyageWithRelations = z.infer<typeof VoyageSchema> & VoyageRelations

export const VoyageWithRelationsSchema: z.ZodType<VoyageWithRelations> = VoyageSchema.merge(z.object({
  vessel: z.lazy(() => VesselWithRelationsSchema),
  voyageUnitType: z.lazy(() => VoyageUnitTypeWithRelationsSchema).array().min(5).nonempty(),
}))

/////////////////////////////////////////
// UNIT TYPE SCHEMA
/////////////////////////////////////////

export const UnitTypeSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  defaultLength: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type UnitType = z.infer<typeof UnitTypeSchema>

// UNIT TYPE RELATION SCHEMA
//------------------------------------------------------

export type UnitTypeRelations = {
  voyageUnitType: VoyageUnitTypeWithRelations[];
};

export type UnitTypeWithRelations = z.infer<typeof UnitTypeSchema> & UnitTypeRelations

export const UnitTypeWithRelationsSchema: z.ZodType<UnitTypeWithRelations> = UnitTypeSchema.merge(z.object({
  voyageUnitType: z.lazy(() => VoyageUnitTypeWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// VOYAGE UNIT TYPE SCHEMA
/////////////////////////////////////////

export const VoyageUnitTypeSchema = z.object({
  id: z.string().cuid(),
  voyageId: z.string(),
  unitTypeId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type VoyageUnitType = z.infer<typeof VoyageUnitTypeSchema>

// VOYAGE UNIT TYPE RELATION SCHEMA
//------------------------------------------------------

export type VoyageUnitTypeRelations = {
  voyage: VoyageWithRelations;
  unitType: UnitTypeWithRelations;
};

export type VoyageUnitTypeWithRelations = z.infer<typeof VoyageUnitTypeSchema> & VoyageUnitTypeRelations

export const VoyageUnitTypeWithRelationsSchema: z.ZodType<VoyageUnitTypeWithRelations> = VoyageUnitTypeSchema.merge(z.object({
  voyage: z.lazy(() => VoyageWithRelationsSchema),
  unitType: z.lazy(() => UnitTypeWithRelationsSchema),
}))
