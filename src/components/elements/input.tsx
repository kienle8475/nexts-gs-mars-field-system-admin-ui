import { cn, nanoid } from "@/utils/common";
import React from "react";

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { autoComplete, label, required, children, className, ...rest } = props;

  const instanceId = nanoid("alpha");

  return (
    <div className={cn("space-y-2")}>
      {label && (
        <label htmlFor={instanceId} className={cn("block w-fit text-[14px] font-medium")}>
          {label}
          {required && <span className="text-red-base"> *</span>}
        </label>
      )}
      <input
        id={instanceId}
        ref={ref}
        className={cn(
          "w-full rounded-md bg-neutral--9 px-4 py-3 text-[14px] font-medium text-text-medium-emp transition-all duration-100 placeholder:text-[14px] placeholder:font-normal placeholder:text-text-low-emp focus:bg-primary--9",
          className,
        )}
        {...rest}
      />
    </div>
  );
});
Input.displayName = "Element.Input";
