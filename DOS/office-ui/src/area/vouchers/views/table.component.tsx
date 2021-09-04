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
// import FormHelperText from "@material-ui/core/FormHelperText";

import { Controller } from "react-hook-form";
import { splitToBulks } from "src/shared/utils/split-to-bulks.util";

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
    minWidth: "100%",
    [theme.breakpoints.up("md")]: {
      minWidth: 700,
    },
    "& thead th": {
      textAlign: "center",
    },
  },
}));

export default function CustomizedTables(props) {
  const classes = useStyles();
  const fieldChunks = splitToBulks(props.fields);
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
              EQUIPOS
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
          {fieldChunks.map((chunk, index) => (
            <StyledTableRow key={index}>
              {chunk.map((item, index) => (
                <>
                  <StyledTableCell component="th" scope="row">
                    {props.getValues(`itemList.${index}.equipmentCode`)}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Controller
                      name={`itemList.${index}.quantity`}
                      control={props.control}
                      render={({ field }) => (
                        <FormControl>
                          <TextField
                            id={`itemList.${index}.equipmentCode`}
                            label=""
                            value={field.value ? field.value || "" : ""}
                          />
                        </FormControl>
                      )}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <FormControl>
                      <TextField
                        id="precio"
                        // label="precio"
                        //multiline
                        //minRows={5}
                        // maxRows={5}
                        // value={field.value ? field.value || "" : ""}
                      />
                    </FormControl>
                  </StyledTableCell>
                </>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
