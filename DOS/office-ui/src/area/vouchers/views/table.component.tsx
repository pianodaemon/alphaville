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
      backgroundColor: "rgba(129,130,133,1)",
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
    '& .MuiTableCell-sizeSmall': {
      padding: '0px',
    },
    minWidth: "100%",
    [theme.breakpoints.up("md")]: {
      minWidth: 700,
    },
    "& thead:not(:first-child) th": {
      textAlign: "right",
    },
    "& tbody td": {
      minWidth: theme.spacing(20),
    },
    "& tbody td input": {
      textAlign: "right",
      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
        appearance: 'none',
      },
      '&[type=number]': {
        appearance: 'textfield',
      }
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
  return (
    <TableContainer component={Paper}>
      <Table
        className={classes.table}
        aria-label="customized table"
        size="small"
      >
        <TableHead>
          <TableRow>
            <StyledTableCell align="center" colSpan={6}>
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
              <StyledTableRow key={i}>
                {chunk.map((item, index) => {
                  const code = getValues(`itemList.${fieldIndex}.equipmentCode`);
                  const quantity = equipments.find(
                    (field) => field.equipmentCode === code
                  )?.quantity;
                  setValue(`itemList.${fieldIndex}.equipmentCode`, item.code);
                  return (
                    <>
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
                                defaultValue={quantity ? quantity || "" : ""}
                                id={`itemList.${fieldIndex}.quantity`}
                                inputProps={{ type: "number" }}
                                style={{
                                  'appearance': 'none'
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
                            {...item}
                            disabled
                            id="precio"
                            inputProps={{ readOnly: true, disabled: true }}
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
                    </>
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
