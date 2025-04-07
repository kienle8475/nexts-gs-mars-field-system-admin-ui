/** @jsxImportSource @emotion/react */
"use client";
import React from "react";
import Calendar, { TileArgs } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { css } from "@emotion/react";
import { cn, nanoid } from "@/utils/common";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { IoCalendarClear } from "react-icons/io5";
import { useControllableState } from "@/hooks/use-controllable-state";
import moment from "moment";
import { Icons } from "./icons";
import { useRippleOutlineStyle } from "@/hooks/use-ripple-outline-style";

interface DatePickerProps extends React.ComponentPropsWithoutRef<"input"> {
  label?: string;
  defaultPickedDate?: Date;
  pickedDate?: Date;
  onPickedDateChange?: (e: Date) => void;
}

export const DatePicker = (props: DatePickerProps) => {
  const {
    defaultPickedDate: defaultPickedDateProp,
    pickedDate: pickedDateProp,
    onPickedDateChange: onPickedDateChangeProp,
    autoComplete,
    label,
    required,
    children,
    className,
    ...rest
  } = props;

  const [pickedDate, setPickedDate] = useControllableState<Date>({
    prop: pickedDateProp,
    defaultProp: defaultPickedDateProp,
    onChange: onPickedDateChangeProp,
  });
  const instanceId = nanoid("alpha");
  const calendarRef = React.useRef();
  const [showCalendar, setShowCalendar] = React.useState(false);

  const rippleOutlineStyle = useRippleOutlineStyle();

  return (
    <div>
      <div className="space-y-2">
        {label && (
          <label htmlFor={instanceId} className={cn("block w-fit text-[14px] font-medium")}>
            {label}
            {required && <span className="text-red-base"> *</span>}
          </label>
        )}

        <Popover placement="top-start" open={showCalendar} onOpenChange={setShowCalendar}>
          <PopoverTrigger onClick={() => setShowCalendar((v) => !v)}>
            <div
              className={cn(
                "flex items-center justify-start gap-[12px] overflow-hidden rounded-md bg-neutral--9 px-4 py-3 transition-all duration-100 focus-within:bg-primary--9",
                { "bg-primary--9": showCalendar },
              )}
            >
              <input
                id={instanceId}
                className={cn(
                  "w-full cursor-pointer bg-transparent text-[14px] font-medium text-text-medium-emp transition-all duration-100 placeholder:text-[14px] placeholder:font-normal placeholder:text-text-low-emp",
                  className,
                  { "text-primary-base": showCalendar },
                )}
                {...rest}
                value={pickedDate ? moment(pickedDate).format("L") : ""}
              />
              {!pickedDate && <IoCalendarClear size={16} className="fill-neutral-base" />}
              {pickedDate && (
                <button
                  type="button"
                  className={cn(
                    "pointer-events-auto shrink-0 rounded-full bg-neutral-base p-1 opacity-100 transition-all duration-100 hover:bg-neutral--1 active:bg-neutral-base",
                  )}
                  css={css`
                    ${rippleOutlineStyle.styles}
                  `}
                  onClick={() => {
                    setPickedDate(undefined);
                  }}
                >
                  <Icons.CloseX width={10} height={10} className="fill-white" />
                </button>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div
              className="h-fit w-fit overflow-hidden rounded-md border border-border-low-emp drop-shadow-gray"
              css={css`
                .react-calendar {
                  padding: 12px;
                  border: none;
                  background-color: #ffffff;
                  border: 0px !important;
                }

                .react-calendar__navigation {
                  align-items: center;
                }

                .react-calendar__navigation__label {
                  font-size: 12px;
                  color: var(--color-text-medium-emp);
                  font-weight: 600;
                  pointer-events: none;
                  text-transform: uppercase;
                }

                .react-calendar__navigation__arrow.react-calendar__navigation__prev-button,
                .react-calendar__navigation__arrow.react-calendar__navigation__next-button {
                  font-size: 18px;
                  font-weight: 500;
                  border-radius: 100%;
                  width: 36px;
                  height: 36px;
                  min-width: 36px;
                  color: var(--color-text-medium-emp);

                  &:hover {
                    background-color: var(--color-neutral--9) !important;
                  }
                  &:active {
                    background-color: var(--color-neutral--8) !important;
                  }
                  &:focus {
                    background-color: transparent;
                  }
                }

                .react-calendar__navigation__arrow.react-calendar__navigation__prev2-button,
                .react-calendar__navigation__arrow.react-calendar__navigation__next2-button {
                  visibility: hidden;
                }

                .react-calendar__month-view__weekdays__weekday {
                  color: var(--color-text-low-emp);
                  & > abbr {
                    text-decoration: none;
                  }
                }

                .react-calendar__tile {
                  color: var(--color-text-medium-emp);
                  border-radius: 4px;

                  &:hover {
                    background-color: var(--color-neutral--9);
                  }
                }

                .react-calendar__tile.react-calendar__month-view__days__day.react-calendar__month-view__days__day--neighboringMonth {
                  opacity: 0.5;
                }

                .react-calendar__tile--now {
                  background: var(--color-green--8);
                  color: var(--color-green-base);
                  font-weight: 600;
                  &:hover {
                    background: var(--color-green--6);
                  }
                }

                .react-calendar__tile--active {
                  background: var(--color-primary--6);
                  color: var(--color-primary-base);
                  font-weight: 600;
                  &:hover {
                    background: var(--color-primary--6);
                  }
                  &:focus {
                    background: var(--color-primary--6);
                  }
                }
              `}
            >
              <Calendar
                ref={calendarRef}
                value={pickedDate}
                onChange={(e) => {
                  setPickedDate(e as Date);
                  setShowCalendar(false);
                }}
                locale="vi-VN"
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
