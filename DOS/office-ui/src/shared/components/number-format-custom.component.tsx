import React from "react";
import NumberFormat, { NumberFormatProps } from "react-number-format";

interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  allowNegatives: boolean;
  formatProps?: NumberFormatProps;
}

export function NumberFormatCustom(props: NumberFormatCustomProps) {
  const { allowNegatives, inputRef, onChange, ...formatProps } = props;

  return (
    <NumberFormat
      fixedDecimalScale
      decimalScale={2}
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
      {...formatProps}
    />
  );
}
