// src/hooks/useForm.ts
import { useForm as useRHForm, UseFormReturn, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ZodSchema } from 'zod';

/**
 * Generic wrapper around react-hook-form that integrates Zod validation.
 *
 * @param schema Zod schema used for validation.
 * @param defaultValues Optional default values for the form fields.
 * @returns The result of react-hook-form's useForm, fully typed.
 */
export function useForm<T>(
  schema: ZodSchema<T>,
  defaultValues?: Partial<T>,
): UseFormReturn<T> {
  const methods = useRHForm<T>({
    resolver: zodResolver(schema) as any,
    defaultValues: defaultValues as any,
    mode: 'onSubmit',
  });
  return methods;
}

/**
 * Convenience type for a submit handler that receives validated data.
 */
export type FormSubmitHandler<T> = SubmitHandler<T>;
