/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";
import { useControllableState } from "@/hooks/use-controllable-state";
import { cn, nanoid } from "@/utils/common";
import { Icons } from "./icons";
import { useRippleOutlineStyle } from "@/hooks/use-ripple-outline-style";

interface PhoneInputProps extends React.ComponentPropsWithoutRef<"input"> {
  label?: string;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>((props, ref) => {
  const {
    autoComplete,
    label,
    required,
    children,
    className,
    value: valueProp,
    onChange: onChangeProp,
    ...rest
  } = props;

  const instanceId = nanoid("alpha");

  const [displayPhone, setDisplayPhone] = React.useState("");

  const rippleOutlineStyle = useRippleOutlineStyle();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, "");

    if (value.startsWith("84") && value.length > 2) {
      value = "0" + value.slice(2);
    }

    if (displayPhone === "+84" && value === "8") {
      value = "";
    }
    if (displayPhone === "+84 " && value === "84") {
      value = "";
    }

    const maxLength = 10;
    value = value.slice(0, maxLength);
    e.target.value = value;
    onChangeProp && onChangeProp(e);

    if (value.startsWith("0")) {
      value = "84" + value.slice(1);
      const restOfPhone = value.slice(2);
      const formattedRest = restOfPhone.replace(/(\d{3})(?=\d)/g, "$1 ");
      setDisplayPhone(`+84 ${formattedRest}`);
    } else if (value === "84") {
      setDisplayPhone("+84");
    } else {
      const formattedValue = value.replace(/(\d{3})(?=\d)/g, "$1 ");
      setDisplayPhone(formattedValue);
    }
  };

  const handleClearPhoneInput = () => {
    setDisplayPhone("");
    onChangeProp &&
      onChangeProp({
        target: {
          value: "",
        },
      } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className={cn("space-y-2")}>
      {label && (
        <label
          htmlFor={instanceId}
          className={cn("block w-fit text-[14px] font-medium focus:bg-primary--9")}
        >
          {label}
          {required && <span className="text-red-base"> *</span>}
        </label>
      )}
      <div className="flex items-center justify-start gap-[12px] overflow-hidden rounded-md bg-neutral--9 px-4 py-3 transition-all duration-100 focus-within:bg-primary--9">
        <Icons.VietnamFlag className="h-[16px] shrink-0 rounded-sm" />
        <input
          id={instanceId}
          ref={ref}
          placeholder="Nhập số điện thoại"
          type="text"
          name="phone"
          autoComplete="phone"
          value={displayPhone}
          onChange={handlePhoneChange}
          className={cn(
            "w-full bg-transparent text-[14px] font-medium text-text-medium-emp transition-all duration-100 placeholder:text-[14px] placeholder:font-normal placeholder:text-text-low-emp",
            className,
          )}
          {...rest}
        />
        <button
          type="button"
          className={cn(
            "pointer-events-none shrink-0 rounded-full bg-neutral-base p-1 opacity-0 transition-all duration-100 hover:bg-neutral--1 active:bg-neutral-base",
            { "pointer-events-auto opacity-100": displayPhone.length > 0 },
          )}
          css={css`
            ${rippleOutlineStyle.styles}
          `}
          onClick={handleClearPhoneInput}
        >
          <Icons.CloseX width={14} height={14} className="fill-white" />
        </button>
      </div>
    </div>
  );
});
PhoneInput.displayName = "Element.PhoneInput";
