import React, { useEffect, useRef } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
// import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import { Voucher } from "src/area/vouchers/state/vouchers.reducer";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Statuses } from "src/shared/constants/voucher-statuses.constants";

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
  searchVoucherAction: Function;
  searchVoucherResetAction: Function;
  loading: boolean | undefined;
  patio: string | null;
  voucher: Voucher | null;
};

export const InNout = (props: Props) => {
  const classes = useStyles();
  const voucherId = useRef(null as any);
  const platform = useRef(null as any);
  const {
    loading,
    patio,
    searchVoucherAction,
    searchVoucherResetAction,
    voucher,
  } = props;
  const handleClick = () => {
    if (voucher) {
      if (voucher.status === Statuses.SALIDA) {
        window.open(`/voucher/${voucher.id}/view`, "_blank");
      } else {
        const canForward: boolean = voucher.patioCode === patio;
        const action: string = canForward ? "forward" : "view";
        window.open(`/voucher/${voucher.id}/${action}`, "_blank");
      }
    }
  };
  useEffect(() => {
    return searchVoucherResetAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Paper className={classes.paper}>
      <h1 style={{ color: "#E31B23", textAlign: "center" }}>
        Entradas y Salidas
      </h1>
      <hr className={classes.hrDivider} />
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl className={classes.formControl}>
              <TextField
                id="voucher"
                inputProps={{
                  autoComplete: "off",
                }}
                inputRef={voucherId}
                label="Ingrese No. de Vale"
                onChange={(event: any) => {
                  if (platform && platform.current) {
                    platform.current.value = "";
                  }
                  if (event.target.value.length > 0) {
                    searchVoucherAction({ id: event.target.value });
                  } else {
                    searchVoucherResetAction();
                  }
                }}
                placeholder="Ejemplo: 1, 23, 100"
              />
            </FormControl>
            <FormControl className={classes.formControl}>
              <TextField
                id="platform"
                inputProps={{
                  autoComplete: "off",
                }}
                inputRef={platform}
                label="Ingrese Plataforma"
                onChange={(event: any) => {
                  if (voucherId && voucherId.current) {
                    voucherId.current.value = "";
                  }
                  if (event.target.value.length > 0) {
                    searchVoucherAction({ platform: event.target.value });
                  } else {
                    searchVoucherResetAction();
                  }
                }}
              />
            </FormControl>
            <div>
              {voucher && (
                <Chip
                  label={`ID: ${voucher.id} - Estatus: ${
                    voucher && voucher.status
                  }`}
                  onClick={handleClick}
                />
              )}
              {loading && (
                <CircularProgress className={classes.progress} size={20} />
              )}
            </div>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};
