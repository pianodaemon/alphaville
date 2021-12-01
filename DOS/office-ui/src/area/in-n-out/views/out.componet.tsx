import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import CircularProgress from "@material-ui/core/CircularProgress";
import { AutoCompleteDropdown } from "src/shared/components/autocomplete-dropdown.component";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      alignItems: "center",
      backgroundColor: "#fff",
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      height: "calc(100vh - 156px)",
      justifyContent: "center",
      overflow: "auto",
    },
    paper: {
      padding: "38px",
      // textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 350,
      [theme.breakpoints.down("sm")]: {
        minWidth: "100%",
        display: "flex",
      },
    },
    fieldset: {
      borderRadius: 3,
      borderWidth: 0,
      borderColor: "#DDD",
      borderStyle: "solid",
      margin: "20px 0px",
    },
    containerLegend: {
      display: "block",
      top: "-30px",
      position: "relative",
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      width: "128px",
      margin: "0px auto",
      textAlign: "center",
      background: "transparent",
      [theme.breakpoints.down("sm")]: {
        margin: "0 auto",
        width: "auto !important",
      },
    },
    legend: {
      fontWeight: "bolder",
      color: "#128aba",
      fontSize: "1rem",
      background: "#FFF",
    },
    textErrorHelper: { color: theme.palette.error.light },
    submitInput: {
      backgroundColor: "#FFFFFF",
      color: "#008aba",
      border: "1px solid #008aba",
      "&:hover": {
        background: "#008aba",
        color: "#FFF",
      },
    },
    hrDivider: {
      borderTop: 0,
      height: "1px",
      /* background: 'linear-gradient(to right,transparent,#dedede,transparent)', */
      background:
        "linear-gradient(to right,transparent,#aaa,#aaa,#aaa,#aaa,#aaa,#aaa,#aaa,#aaa,transparent)",
      width: "100%",
      border: 0,
      margin: 0,
      padding: 0,
      display: "block",
      unicodeBidi: "isolate",
      marginBlockStart: "0.5em",
      marginBlockEnd: "0.5em",
      marginInlineStart: "auto",
      marginInlineEnd: "auto",
      overflow: "hidden",
      marginTop: "27px",
    },
    hrSpacer: {
      height: "25px",
      border: "none",
    },
    progress: {
      margin: "0 auto",
      marginTop: "10px",
      verticalAlign: "middle",
    },
  })
);

type Props = {
  loadCarriersAction: Function;
  carriers: any;
};

export const Out = (props: Props) => {
  const classes = useStyles();
  const history = useHistory();
  const { carriers, loadCarriersAction } = props;
  useEffect(() => {
    return loadCarriersAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(carriers);
  return (
    <Paper className={classes.paper}>
      <h1 style={{ color: "#E31B23", textAlign: "center" }}>Salidas de Equipo</h1>
      <hr className={classes.hrDivider} />
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <FormControl className={classes.formControl}>
              <AutoCompleteDropdown
                fieldLabel="carrierName"
                fieldValue="code"
                label="Carrier"
                name="carrier"
                onChange={(value: any) => {
                  // return setValue("receivedBy", value);
                }}
                options={carriers || []}
                value={""}
              />
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};
