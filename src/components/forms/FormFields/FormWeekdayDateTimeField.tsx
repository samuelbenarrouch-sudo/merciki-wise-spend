import { Controller, type Control } from "react-hook-form";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FieldShell, type BaseFieldProps } from "./shared";

interface Props extends BaseFieldProps {
  control: Control<any>;
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

// La valeur stockée est une chaîne "yyyy-MM-dd HH:mm".
function splitValue(value: unknown): { date?: Date; time: string } {
  const raw = typeof value === "string" ? value : "";
  const [datePart, timePart] = raw.split(" ");
  const date = datePart ? new Date(`${datePart}T00:00:00`) : undefined;
  return {
    date: date && !Number.isNaN(date.getTime()) ? date : undefined,
    time: timePart ?? "",
  };
}

export function FormWeekdayDateTimeField({
  name,
  label,
  control,
  required,
  description,
}: Props) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const { date, time } = splitValue(field.value);

        const commit = (nextDate?: Date, nextTime?: string) => {
          const d = nextDate ?? date;
          const t = nextTime ?? time;
          if (!d) return field.onChange("");
          field.onChange(`${format(d, "yyyy-MM-dd")}${t ? ` ${t}` : ""}`);
        };

        return (
          <FieldShell
            id={name}
            label={label}
            required={required}
            description={description}
            error={fieldState.error?.message}
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id={name}
                    type="button"
                    variant="outline"
                    className={cn(
                      "h-12 flex-1 justify-start rounded-lg text-left font-normal",
                      !date && "text-slate",
                    )}
                  >
                    <CalendarIcon className="h-4 w-4" strokeWidth={1.75} />
                    {date
                      ? format(date, "EEEE d MMMM yyyy", { locale: fr })
                      : "Choisir une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    locale={fr}
                    selected={date}
                    onSelect={(d) => d && commit(d)}
                    disabled={(d) =>
                      d < startOfToday() || ![3, 4].includes(d.getDay())
                    }
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                aria-label="Heure du rendez-vous"
                value={time}
                onChange={(e) => commit(undefined, e.target.value)}
                className="h-12 rounded-lg sm:w-40"
              />
            </div>
          </FieldShell>
        );
      }}
    />
  );
}