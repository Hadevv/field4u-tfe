/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { type ComponentProps } from "react";
import { format, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

type DateRangePickerProps = {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange | undefined) => void;
  disabled?: boolean;
  minDate?: Date;
} & ComponentProps<"div">;

export function DateRangePicker({
  className,
  dateRange,
  onDateRangeChange,
  disabled = false,
  minDate,
  ...props
}: DateRangePickerProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSelectingFirstDate, setIsSelectingFirstDate] = useState(true);
  const [month, setMonth] = useState<Date | undefined>(
    dateRange?.from || new Date(),
  );
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    dateRange,
  );

  useEffect(() => {
    setSelectedRange(dateRange);
  }, [dateRange]);

  const onApply = () => {
    if (selectedRange?.from && selectedRange?.to) {
      onDateRangeChange(selectedRange);
      setIsPopoverOpen(false);
    }
  };

  const handleRangeChange = (range: DateRange | undefined) => {
    setSelectedRange(range);

    if (range?.from && range?.to) {
      setIsSelectingFirstDate(true);
    } else if (range?.from) {
      setIsSelectingFirstDate(false);
    }
  };

  const calculateDurationInDays = (from: Date, to: Date) => {
    return Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
  };

  const parseInputDate = (value: string) => {
    try {
      const parts = value.split("/");
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const date = new Date(year, month, day);

        return isValid(date) ? date : null;
      }
    } catch (error) {
      console.error("Erreur lors de la conversion de la date:", error);
    }
    return null;
  };

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full h-12 justify-start text-left font-normal shadow-sm transition-colors",
              !dateRange && "text-muted-foreground",
              isPopoverOpen && "ring-2 ring-primary ring-offset-2",
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-3 h-5 w-5" />
            {dateRange?.from ? (
              dateRange.to ? (
                <div>
                  <div className="font-semibold">
                    {format(dateRange.from, "dd MMM yyyy", { locale: fr })} -{" "}
                    {format(dateRange.to, "dd MMM yyyy", { locale: fr })}
                  </div>
                  <div className="text-xs mt-0.5">
                    Durée:{" "}
                    {calculateDurationInDays(dateRange.from, dateRange.to)}{" "}
                    jours
                  </div>
                </div>
              ) : (
                <div className="font-semibold">
                  {format(dateRange.from, "dd MMM yyyy", { locale: fr })}
                </div>
              )
            ) : (
              <span>Sélectionner une période</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 rounded-xl shadow-lg"
          align="center"
        >
          <div className="p-5">
            {/* Calendrier */}
            <div>
              <div className="grid grid-cols-2 gap-2 px-0.5 mb-4">
                <div>
                  <div className="text-sm font-medium mb-1">Date de début</div>
                  <div className="relative">
                    <Input
                      value={
                        selectedRange?.from
                          ? format(selectedRange.from, "dd/MM/yyyy")
                          : ""
                      }
                      onChange={(e) => {
                        const date = parseInputDate(e.target.value);
                        if (date) {
                          setSelectedRange({
                            from: date,
                            to: selectedRange?.to,
                          });
                          setIsSelectingFirstDate(false);
                        }
                      }}
                      className="pl-9"
                      placeholder="JJ/MM/AAAA"
                    />
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1">Date de fin</div>
                  <div className="relative">
                    <Input
                      value={
                        selectedRange?.to
                          ? format(selectedRange.to, "dd/MM/yyyy")
                          : ""
                      }
                      onChange={(e) => {
                        const date = parseInputDate(e.target.value);
                        if (date) {
                          setSelectedRange({
                            from: selectedRange?.from,
                            to: date,
                          });
                        }
                      }}
                      className=" pl-9"
                      placeholder="JJ/MM/AAAA"
                    />
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                  </div>
                </div>
              </div>

              <Calendar
                mode="range"
                defaultMonth={month}
                onMonthChange={setMonth}
                selected={selectedRange}
                onSelect={handleRangeChange}
                numberOfMonths={2}
                locale={fr}
                classNames={{
                  months:
                    "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-2",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button:
                    "size-7 bg-transparent p-0 opacity-75 hover:opacity-100",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell:
                    "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full",
                  cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-primary/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "size-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary",
                  day_selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-gray-300 opacity-50",
                  day_disabled: "text-gray-300 opacity-50",
                  day_range_middle:
                    "aria-selected:bg-primary/10 aria-selected:text-primary",
                  day_hidden: "invisible",
                }}
                disabled={minDate ? (date) => date < minDate : undefined}
                showOutsideDays={false}
              />

              {/* boutons d'action */}
              <div className="flex justify-end mt-4 border-t pt-4 px-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsPopoverOpen(false)}
                  className="mr-2"
                >
                  Annuler
                </Button>
                <Button
                  size="sm"
                  onClick={onApply}
                  disabled={!selectedRange?.from || !selectedRange?.to}
                >
                  Appliquer
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {dateRange?.from && dateRange?.to && (
        <div className="text-sm text-muted-foreground mt-1 pl-1">
          Durée de la période:{" "}
          {calculateDurationInDays(dateRange.from, dateRange.to)} jours
        </div>
      )}
    </div>
  );
}
