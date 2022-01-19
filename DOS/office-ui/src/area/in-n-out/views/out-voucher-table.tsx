import React, { useState } from "react";
import { TextField } from "@material-ui/core";
import MaterialTable, { MTableActions } from "material-table";

type Props = {
  onUpdate: Function;
  values: any;
};

export function BulkEdit({ onUpdate, values }: Props) {
  const [columns] = useState([
    {
      title: "Vale #",
      field: "voucher",
      editable: "never",
    },
    {
      title: "Equipo",
      field: "equipment",
      // initialEditValue: "initial edit value",
      editable: "never",
    },
    {
      title: "Unidades",
      field: "units",
      type: "numeric",
      editable: "never",
    },
    {
      title: "Cantidad a agregar",
      field: "quantity",
      // lookup: { 34: "İstanbul", 63: "Şanlıurfa" },
      type: "numeric",
      max: 12,
      editComponent: (props) => {
        return (
          <TextField
            value={props.value}
            inputProps={{
              ...props.inputProps,
              min: 0,
              step: 1,
              // pattern: "[0-9]",
              max: 12,
              type: "number",
            }}
            onChange={(event) => {
              // const value = parseInt(event.target.value, 10);
              if (
                parseInt(event.target.value, 10) <= 12222 ||
                event.target.value === "" ||
                event.target.value === "0"
              ) {
                props.onChange(event.target.value);
              }
            }}
          />
        );
      },
    },
  ]);

  return (
    <MaterialTable
      title="Listado de Vales (carrier: {carrier})"
      columns={
        [
          ...columns.map((c) => {
            return { ...c };
          }),
        ] as any
      }
      data={[
        ...values
          .map((item) => {
            return item.itemList.map((i) => {
              return {
                voucher: item.id,
                equipmentCode: i.code,
                equipment: i.title,
                units: i.quantity,
                quantity: 0,
              };
            });
          })
          .flat(),
      ]}
      editable={{
        onBulkUpdate: (changes) => {
          console.log(
            "changes: ",
            changes,
            Object.values(changes).map((i) => i.newData)
          );
          onUpdate(Object.values(changes).map((i) => i.newData));
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(1);
            }, 100);
          });
        },
        onRowDelete: (oldData) =>
          new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(1);
            }, 1000);
          }),
      }}
      options={{
        search: false,
        paging: false,
      }}
      components={{
        Actions: (props) => {
          // @todo send a PR to @material-table repo to document = bulkEditTooltip & bulkEditApprove & bulkEditCancel
          if (Array.isArray(props.actions) && props.actions.length === 3) {
            props.actions[0].tooltip = "Editar Unidades";
            props.actions[1].tooltip = "Salvar cambios";
            props.actions[2].tooltip = "Descartar cambios";
          }

          return <MTableActions {...props} />;
        },
      }}
    />
  );
}
