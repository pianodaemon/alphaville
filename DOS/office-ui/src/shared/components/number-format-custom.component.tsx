import React from "react";
import NumberFormat, { NumberFormatProps } from "react-number-format";

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  allowNegatives: boolean;
  formatProps?: NumberFormatProps;
  max?: number;
}

export function NumberFormatCustom(props: NumberFormatCustomProps) {
  const { allowNegatives, inputRef, onChange, max, ...formatProps } = props;

  return (
    <NumberFormat
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      prefix=""
      allowNegative={allowNegatives || false}
      {...(max
        ? {
            isAllowed: (values) => {
              const { formattedValue, floatValue } = values;
              return formattedValue === "" || (floatValue || 0) <= max;
            },
          }
        : {})}
      {...formatProps}
    />
  );
}
