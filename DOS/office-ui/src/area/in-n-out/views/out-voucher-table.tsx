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
      // defaultGroupOrder: 0,
    },
    {
      title: "Equipo",
      field: "equipmentCode",
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
      title: "Cantidad a Retornar",
      field: "quantity",
      // lookup: { 34: "İstanbul", 63: "Şanlıurfa" },
      type: "numeric",
      max: 12,
      editable: "always",
      editComponent: (props) => {
        return (
          <TextField
            value={props.value}
            inputProps={{
              ...props.inputProps,
              min: 0,
              step: 1,
              max: props.rowData.units,
              type: "number",
            }}
            onChange={(event) => {
              const { value } = event.target;
              if (
                parseInt(value, 10) <= props.rowData.units ||
                value === "" ||
                value === "0"
              ) {
                props.onChange(value);
              }
            }}
          />
        );
      },
    },
  ]);
  const tableHeight =
    ((window.innerHeight - 64 - 64 - 52 - 1) / window.innerHeight) * 30;
  return (
    <div>
      <MaterialTable
        title="Listado de Equipo/Unidade por Vale"
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
                  equipmentCode: i.equipmentCode,
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
            onUpdate(Object.values(changes).map((i) => i.newData));
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve(1);
              }, 100);
            });
          },
          // @todo Implement this for custom row removal
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
          // grouping: true,
          maxBodyHeight: `${tableHeight}vh`,
          minBodyHeight: `${tableHeight}vh`,
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
    </div>
  );
}
