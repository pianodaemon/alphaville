import React, { useEffect } from "react";
// import { useHistory } from "react-router-dom";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
// import FormHelperText from "@material-ui/core/FormHelperText";
// import TextField from "@material-ui/core/TextField";
// import Chip from "@material-ui/core/Chip";
// import CircularProgress from "@material-ui/core/CircularProgress";
import { AutoCompleteDropdown } from "src/shared/components/autocomplete-dropdown.component";
import { JSONPrettyPrint } from "src/shared/utils/json-pretty-print";
import MultipleSelect from "./multi-select-chip.component";
import { BulkEdit } from "./out-voucher-table";

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

const schema = yup.object().shape({
  carrierCode: yup.string().required(),
  patioCode: yup.string().required(),
  platform: yup.string().required(),
  vouchers: yup
    .array()
    .test("test", "at least one item with quantity > 0", (value: any) => {
      return value && value.some((val) => val.quantity > 0);
    }),
  itemsToReturnList: yup
    .array()
    .test("test", "at least one item with quantity > 0", (value: any) => {
      return value && value.some((val) => val.quantity > 0);
    }),
});

type Props = {
  loadCarriersAction: Function;
  carriers: any;
};

const VoucherData = [
  {
    id: 1,
    carrierCode: "ABC",
    itemList: [
      {
        code: "BARR003",
        title: "BARROTES 4X4X5",
        quantity: 100,
      },
      {
        code: "RATCHET002",
        title: 'RATCHET 4"',
        quantity: 200,
      },
      {
        code: "RATCHET001",
        title: 'RATCHET 2"',
        quantity: 300,
      },
      {
        code: "ESTACAS001",
        title: "ESTACAS",
        quantity: 400,
      },
      {
        code: "HULE001",
        title: "HULES",
        quantity: 500,
      },
    ],
    patioCode: "PATIOCODE",
    platform: "PLATFORM",
    status: "TRANSFER",
    unitCode: "UNITCODE",
  },
  {
    id: 2,
    carrierCode: "ABC",
    itemList: [
      {
        code: "BARR003",
        title: "BARROTES 4X4X5",
        quantity: 100,
      },
      {
        code: "RATCHET002",
        title: 'RATCHET 4"',
        quantity: 200,
      },
      {
        code: "RATCHET001",
        title: 'RATCHET 2"',
        quantity: 300,
      },
      {
        code: "ESTACAS001",
        title: "ESTACAS",
        quantity: 400,
      },
      {
        code: "HULE001",
        title: "HULES",
        quantity: 500,
      },
    ],
    patioCode: "PATIOCODE",
    platform: "PLATFORM",
    status: "TRANSFER",
    unitCode: "UNITCODE",
  },
];

export const Out = (props: Props) => {
  const classes = useStyles();
  // const history = useHistory();
  const { carriers, loadCarriersAction } = props;
  const initialValues = {
    carrierCode: "",
    itemsToReturnList: [],
    // vouchers: VoucherData || [],
    selectedVouchers: [],
  };
  const {
    control,
    // handleSubmit,
    // formState: { errors, isSubmitting },
    // reset,
    // getValues,
    setValue,
    watch,
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });
  const selectedVouchers = useWatch({control, name: "selectedVouchers"});
  const carrierCode = useWatch({control, name: "carrierCode"});
  useEffect(() => {
    return loadCarriersAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <Paper className={classes.paper}>
      <h1 style={{ color: "#E31B23", textAlign: "center" }}>
        Salidas de Equipo
      </h1>
      <hr className={classes.hrDivider} />
      <form>
        <Grid
          container
          spacing={3}
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={12} sm={12}>
            <Controller
              name="carrierCode"
              control={control}
              render={({ field }) => (
                <FormControl className={classes.formControl}>
                  <AutoCompleteDropdown
                    fieldLabel="carrierName"
                    fieldValue="code"
                    label="Carrier"
                    name="carrier"
                    onChange={(value: any) => {
                      return setValue("carrierCode", value);
                    }}
                    options={carriers || []}
                    value={carriers && field.value ? field.value || "" : ""}
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name="selectedVouchers"
              control={control}
              render={({ field }) => (
                <MultipleSelect
                  options={
                    VoucherData.filter(
                      (voucher) => voucher.carrierCode === carrierCode
                    ) || []
                  }
                  field={field}
                  onChange={(e: any) => {
                    return setValue("selectedVouchers", e.target.value);
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <BulkEdit
              onUpdate={(value: any) => {
                return setValue("itemsToReturnList", value);
              }}
              values={
                VoucherData.filter(
                  (voucher: any) =>
                    voucher.carrierCode ===
                    carrierCode && [...selectedVouchers as any].includes(voucher.id)
                ) || []
              }
            />
          </Grid>
        </Grid>
      </form>
      <JSONPrettyPrint json={watch()} /> 
    </Paper>
  );
};
