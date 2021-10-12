import React from "react";

export default function useFormInput(initialValue: string | number) {
  const [value, setValue] = React.useState<typeof initialValue>(initialValue);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  return { value, onChange };
}
