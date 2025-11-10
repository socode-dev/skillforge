import {
  useForm,
  type DefaultValues,
  type UseFormReturn,
  type FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type Mode = "onBlur" | "onChange" | "onSubmit" | "onTouched" | "all";

export const useAuthForm = <T extends FieldValues>(
  schema: z.ZodType<T>,
  mode: Mode,
  defaultValues?: DefaultValues<T>
): UseFormReturn<T, any, T> => {
  const form = useForm<T>({
    resolver: zodResolver(
      schema as any
    ) as unknown as import("react-hook-form").Resolver<T>,
    defaultValues: defaultValues ?? ({} as DefaultValues<T>),
    mode: mode,
  });

  return form;
};
