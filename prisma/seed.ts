import { Prisma, PrismaClient } from "@prisma/client";
import { addDays, setHours, startOfHour } from "date-fns";

const prisma = new PrismaClient();

interface UnitType {
  id: string;
  allowDrivers: boolean;
  name: string;
  unitGroupId: string;
  length: number;
  mandatoryField: string;
  unitNumberAvailable: boolean;
}

const unitTypes: UnitType[] = [
  {
    id: "20FL",
    allowDrivers: false,
    name: "Flat 20",
    unitGroupId: "FLA",
    length: 6.1,
    mandatoryField: "UnitNumber",
    unitNumberAvailable: true,
  },
  {
    id: "40FL",
    allowDrivers: false,
    name: "Flat 40",
    unitGroupId: "FLA",
    length: 12.2,
    mandatoryField: "UnitNumber",
    unitNumberAvailable: true,
  },
  {
    id: "45FL",
    allowDrivers: false,
    name: "Flat 45",
    unitGroupId: "FLA",
    length: 13.72,
    mandatoryField: "UnitNumber",
    unitNumberAvailable: true,
  },
  {
    id: "CON20",
    allowDrivers: false,
    name: "Container 20",
    unitGroupId: "CON",
    length: 6.1,
    mandatoryField: "UnitNumber",
    unitNumberAvailable: true,
  },
  {
    id: "CON30",
    allowDrivers: false,
    name: "Container 30",
    unitGroupId: "CON",
    length: 9.15,
    mandatoryField: "UnitNumber",
    unitNumberAvailable: true,
  },
  {
    id: "CON40",
    allowDrivers: false,
    name: "Container 40",
    unitGroupId: "CON",
    length: 12.2,
    mandatoryField: "UnitNumber",
    unitNumberAvailable: true,
  },
  {
    id: "CON45",
    allowDrivers: false,
    name: "Container 45",
    unitGroupId: "CON",
    length: 13.72,
    mandatoryField: "UnitNumber",
    unitNumberAvailable: true,
  },
  {
    id: "TC20",
    allowDrivers: false,
    name: "Tankcontainer 20",
    unitGroupId: "CON",
    length: 6.1,
    mandatoryField: "UnitNumber",
    unitNumberAvailable: true,
  },
  {
    id: "TC23",
    allowDrivers: false,
    name: "Tankcontainer 23",
    unitGroupId: "CON",
    length: 7.15,
    mandatoryField: "UnitNumber",
    unitNumberAvailable: true,
  },
  {
    id: "TC24",
    allowDrivers: false,
    name: "Tankcontainer 24",
    unitGroupId: "CON",
    length: 7.45,
    mandatoryField: "UnitNumber",
    unitNumberAvailable: true,
  },
  {
    id: "TC25",
    allowDrivers: false,
    name: "Tankcontainer 25",
    unitGroupId: "CON",
    length: 7.62,
    mandatoryField: "UnitNumber",
    unitNumberAvailable: true,
  },
  {
    id: "TC26",
    allowDrivers: false,
    name: "Tankcontainer 26",
    unitGroupId: "CON",
    length: 7.82,
    mandatoryField: "UnitNumber",
    unitNumberAvailable: true,
  },
  {
    id: "TC30",
    allowDrivers: false,
    name: "Tankcontainer 30",
    unitGroupId: "CON",
    length: 9.15,
    mandatoryField: "UnitNumber",
    unitNumberAvailable: true,
  },
  {
    id: "TC33",
    allowDrivers: false,
    name: "Tankcontainer 33",
    unitGroupId: "CON",
    length: 10,
    mandatoryField: "UnitNumber",
    unitNumberAvailable: true,
  },
  {
    id: "TC40",
    allowDrivers: false,
    name: "Tankcontainer 40",
    unitGroupId: "CON",
    length: 12.2,
    mandatoryField: "UnitNumber",
    unitNumberAvailable: true,
  },
];

// Math.random (extractUnitTypeIds.length)

async function main() {
  const crownSeaways = await prisma.vessel.create({
    data: {
      name: "Crown Seaways",
    },
  });

  const pearlSeaways = await prisma.vessel.create({
    data: {
      name: "Pearl Seaways",
    },
  });

  // Seeding units based on the predefined unitTypes array
  const unitTypesData = [];
  for (let i = 0; i < 10; i++) {
    const unitType = unitTypes[i % unitTypes.length]; // Loop back to start if i >= unitTypes.length

    if (unitType) {
      const unit = await prisma.unitType.create({
        data: {
          name: unitType.name,
          defaultLength: unitType.length, // Using 'length' as default length
        },
      });

      unitTypesData.push(unit);
    }
  }
  const extractUnitTypeIds = unitTypesData.map((unitType) => unitType.id);

  function getRandomUnitTypeIds(extractUnitTypeIds: string[], count: number) {
    const randomIds = [];
    const availableIds = [...extractUnitTypeIds];

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * availableIds.length);
      const randomId = availableIds.splice(randomIndex, 1)[0]!; // Add non-null assertion
      randomIds.push({
        unitType: {
          connect: { id: randomId },
        },
      });
    }

    return randomIds;
  }

  // Seeding voyages
  for (let i = 0; i < 10; i++) {
    const departingFromCopenhagenVessel =
      i % 2 === 0 ? pearlSeaways.id : crownSeaways.id;
    const departingFromOsloVessel =
      i % 2 === 0 ? crownSeaways.id : pearlSeaways.id;

    const scheduledDeparture = startOfHour(
      setHours(addDays(new Date(), i), 15)
    );

    const scheduledArrival = startOfHour(
      setHours(addDays(new Date(), i + 1), 9)
    );
    try {
      await prisma.voyage.create({
        data: {
          portOfLoading: "Copenhagen",
          portOfDischarge: "Oslo",
          vesselId: departingFromCopenhagenVessel,
          scheduledDeparture,
          scheduledArrival,
          voyageUnitType: {
            create: getRandomUnitTypeIds(extractUnitTypeIds, 5),
          },
        },
      });
      await prisma.voyage.create({
        data: {
          portOfLoading: "Oslo",
          portOfDischarge: "Copenhagen",
          vesselId: departingFromOsloVessel,
          scheduledDeparture,
          scheduledArrival,
          voyageUnitType: {
            create: getRandomUnitTypeIds(extractUnitTypeIds, 5),
          },
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e);
      }
      throw e;
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
