import React, { useEffect } from "react";
import {
  withStyles,
  Theme,
  createStyles,
  makeStyles,
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import { Controller } from "react-hook-form";
import { splitToBulks } from "src/shared/utils/split-to-bulks.util";
import { NumberFormatCustom } from "src/shared/components/number-format-custom.component";

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: "rgba(63, 81, 181, 1)",
      color: theme.palette.common.white,
      // width: "33.33%",
    },
    body: {
      fontSize: 14,
      textAlign: "right",
    },
  })
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  })
)(TableRow);

const useStyles = makeStyles((theme) => ({
  table: {
    "& .MuiTableCell-sizeSmall": {
      padding: "0px",
      "&:nth-child(4)": {
        paddingRight: "15px",
        borderLeft: "2px solid #ccc",
        /*"&::before": {
          // left: "-6px",
          top: "10px",
          width: "10px",
          height: "10px",
          content: '" "',
          display: "block",
          // position: "relative",
          borderRadius: "50%",
          verticalAlign: "middle",
          borderLeft: "2px solid blue",
          borderRight: "2px solid blue",
          margin: "0",
        },*/
      },
      "&:nth-child(3)": {
        paddingRight: "100px",
      },
    },
    minWidth: "100%",
    [theme.breakpoints.up("md")]: {
      minWidth: 700,
    },
    "& thead:not(:first-child) th": {
      textAlign: "right",
    },
    "& thead th:last-child": {
      paddingRight: theme.spacing(4),
    },
    "& tbody td:last-child": {
      paddingRight: theme.spacing(4),
    },
    "& tbody td": {
      minWidth: theme.spacing(20),
    },
    "& tbody td input": {
      textAlign: "right",
      "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
        appearance: "none",
      },
      "&[type=number]": {
        appearance: "textfield",
      },
      "&[disabled]": {
        color: "rgba(63, 81, 181, 1)",
      },
    },
    "& tbody tr :nth-child(4)": {
      [theme.breakpoints.down("md")]: {
        paddingLeft: theme.spacing(8),
      },
    },
  },
}));

type Props = {
  control: any;
  equipments: any[];
  getValues: Function;
  setValue: Function;
};

export default function CustomizedTables(props: Props) {
  const classes = useStyles();
  const { control, getValues, equipments, setValue } = props;
  const filteredEquipments = Array.isArray(equipments)
    ? equipments.filter((equipment: any) => equipment.regular)
    : [];
  const equipmentChunks = splitToBulks(filteredEquipments || []);
  let fieldIndex = 0;
  useEffect(() => {
    let index = 0;
    equipmentChunks.forEach((chunk) => {
      chunk.forEach((item) => {
        setValue(`itemList.${index}.equipmentCode`, item.code);
        index++;
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <TableContainer component={Paper}>
      <Table
        className={classes.table}
        aria-label="customized table"
        size="small"
      >
        <TableHead>
          <TableRow>
            <StyledTableCell
              style={{ backgroundColor: "rgba(63, 81, 181, 1)" }}
              align="center"
              colSpan={6}
            >
              EQUIPOS DE AMARRE
            </StyledTableCell>
          </TableRow>

          <TableRow>
            <StyledTableCell></StyledTableCell>
            <StyledTableCell align="right">Unidad</StyledTableCell>
            <StyledTableCell align="right">Costo Unitario</StyledTableCell>

            <StyledTableCell></StyledTableCell>
            <StyledTableCell align="right">Unidad</StyledTableCell>
            <StyledTableCell align="right">Costo Unitario</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {equipmentChunks.map((chunk, i) => {
            return (
              <StyledTableRow key={`${i + 1}-row`}>
                {chunk.map((item, index) => {
                  const code = getValues(
                    `itemList.${fieldIndex}.equipmentCode`
                  );
                  const quantity = equipments.find(
                    (field) => field.equipmentCode === code
                  )?.quantity;
                  return (
                    <React.Fragment key={`${index}-cell`}>
                      <StyledTableCell component="th" scope="row">
                        {item.title}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <Controller
                          name={`itemList.${fieldIndex}.quantity`}
                          control={control}
                          render={({ field }) => (
                            <FormControl>
                              <TextField
                                {...field}
                                defaultValue={quantity ? quantity || "0" : "0"}
                                id={`itemList.${fieldIndex}.quantity`}
                                // inputProps={{ type: "number", min: "0" }}
                                InputProps={{
                                  inputComponent: NumberFormatCustom as any,
                                }}
                                style={{
                                  appearance: "none",
                                }}
                                label=""
                              />
                            </FormControl>
                          )}
                        />
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <FormControl>
                          <TextField
                            disabled
                            id="precio"
                            inputProps={{
                              readOnly: true,
                              disabled: true,
                              fixedDecimalScale: true,
                              decimalScale: 2,
                            }}
                            InputProps={{
                              inputComponent: NumberFormatCustom as any,
                              startAdornment: "$",
                            }}
                            label=""
                            value={item.unitCost}
                          />
                        </FormControl>
                      </StyledTableCell>
                      {++fieldIndex && null}
                    </React.Fragment>
                  );
                })}
                {equipments &&
                  filteredEquipments.length % 2 !== 0 &&
                  equipmentChunks.length - 1 === i && (
                    <>
                      <StyledTableCell
                        component="th"
                        scope="row"
                      ></StyledTableCell>
                      <StyledTableCell align="right"></StyledTableCell>
                      <StyledTableCell align="right"></StyledTableCell>
                    </>
                  )}
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
