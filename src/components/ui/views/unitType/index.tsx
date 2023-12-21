import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { UnitType } from "@prisma/client";

function UnitTypes({ unitTypes }: { unitTypes: UnitType[] }) {
  // const types = _unitTypes.map((type: UnitType) => ({
  //   ...type,
  // }));
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>{unitTypes.length}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end">
        <Card>
          <CardHeader>
            <CardTitle>Unit types</CardTitle>
          </CardHeader>
          <CardContent className="pr-0">
            <ScrollArea className="h-[400px]">
              <div className="flex flex-col space-y-4">
                {unitTypes.map((type, index: number) => (
                  <div className="flex flex-col space-y-2" key={index}>
                    <p className="m-t-1 text-sm">Name</p>
                    <p className="m-t-1 text-sm text-gray-500">{type.name}</p>
                    <p className="m-t-1 text-sm">Default Length</p>
                    <p className="m-t-1 text-sm text-gray-500">
                      {type.defaultLength}
                    </p>
                    <div
                      data-orientation="horizontal"
                      role="none"
                      className="h-[1px] w-full shrink-0 bg-border"
                    ></div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

export { UnitTypes };
