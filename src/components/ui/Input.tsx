import clsx from "clsx";
import type { RefAttributes } from "react";

interface InputProps extends RefAttributes<HTMLInputElement> {
  label?: string;
  name?: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "checkbox"
    | "radio"
    | "date"
    | "image"
    | "file"
    | "range";
  placeholder?: string;
  className?: string;
  labelClassName?: string;
}

const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  className,
  labelClassName,
  ...props
}: InputProps) => {
  return (
    <>
      {label && (
        <label
          htmlFor={name}
          className={clsx(
            "text-sm font-semibold text-foreground",
            labelClassName
          )}
        >
          {label}
        </label>
      )}
      <input
        {...props}
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        className={clsx(
          "rounded-radius-xl bg-input text-foreground text-sm border-1 border-border outline-none focus:border-2 focus:border-primary/80 focus:shadow shadow-soft-primary transition",
          className
        )}
      />
    </>
  );
};

export default Input;
