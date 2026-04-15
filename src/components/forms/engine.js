"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import GenericInput from "../inputs/generic-input";

export default function GenericForm({ schema, fields, onSubmit, initialValues, id }) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  return (
    <Form {...form}>
      <form id={id} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((fieldConfig) => (
          <FormField
            key={fieldConfig.key || fieldConfig.name}
            control={form.control}
            name={fieldConfig.name}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{fieldConfig.label}</FormLabel>
                <FormControl>
                  <GenericInput
                    {...field}
                    type={fieldConfig.type}
                    placeholder={fieldConfig.placeholder}
                    rows={fieldConfig.rows}
                    error={fieldState.error?.message}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ))}
      </form>
    </Form>
  );
}
