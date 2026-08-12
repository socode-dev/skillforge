import {
  useForm,
  type DefaultValues,
  type UseFormReturn,
  type FieldValues,
  type Mode,
  type Resolver
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const useAuthForm = <T extends FieldValues>(
  schema: z.ZodType<T>,
  mode: Mode,
  defaultValues?: DefaultValues<T>
): UseFormReturn<T, undefined, T> => {
  
  const form = useForm<T>({
    resolver: zodResolver(
      schema as Parameters<typeof zodResolver>[0]
    ) as unknown as Resolver<T>,
    defaultValues: defaultValues ?? ({} as DefaultValues<T>),
    mode: mode,
  });

  return form;
};
