import React, { useEffect, useMemo, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import { AutoCompleteDropdown } from "src/shared/components/autocomplete-dropdown.component";
import { Statuses } from "src/shared/constants/voucher-statuses.constants";
import MultipleSelect from "./multi-select-chip.component";
import { BulkEdit } from "./out-voucher-table";

type Props = {
  loadCarriersCatalogAction: Function;
  loadVouchersCatalogAction: Function;
  createOutVoucherResetAction: Function;
  createOutVoucherAction: Function;
  readVoucherOutAction: Function;
  carriers: any;
  username: string;
  vouchers: any;
  vouchersOut: any;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    formControlFull: {
      margin: theme.spacing(1),
      minWidth: 350,
      [theme.breakpoints.up("xs")]: {
        minWidth: "100%",
        display: "flex",
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
  })
);

const schema = yup.object().shape({
  carrierCode: yup.string().required(),
  itemsToReturnList: yup.array().required(),
  patioCode: yup.string().required(),
  platform: yup.string().required(),
});

export const Out = (props: Props) => {
  const classes = useStyles();
  const history = useHistory();
  const {
    carriers,
    loadCarriersCatalogAction,
    loadVouchersCatalogAction,
    createOutVoucherResetAction,
    createOutVoucherAction,
    readVoucherOutAction,
    username,
    vouchers,
    vouchersOut,
  } = props;
  const initialValues = {
    carrierCode: "",
    itemsToReturnList: [],
    observations: "",
    patioCode: "NLD",
    platform: "",
    selectedVouchers: [],
    vouchers,
  };
  const {
    control,
    handleSubmit,
    formState: { errors /* isSubmitting */ },
    reset,
    // getValues,
    setValue,
    // watch,
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });
  const carrierCode = useWatch({ control, name: "carrierCode" });
  const platform = useWatch({ control, name: "platform" });
  const observations = useWatch({ control, name: "observations" });
  const refSubmitButtom = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    loadCarriersCatalogAction({
      per_page: Number.MAX_SAFE_INTEGER,
    });
    return () => {
      createOutVoucherResetAction();
      reset({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onSubmit: (fields: any) => void = (fields: any) => {
    /* @todo implement const releaseForm: () => void = () => setSubmitting(false); */
    const data = {
      carrierCode,
      deliveredBy: username,
      itemsToReturnList: fields.itemsToReturnList,
      observations,
      patioCode: "NLD",
      platform,
      receivedBy: "",
      unitCode: "",
    };
    createOutVoucherAction({ data, history });
  };
  console.log('errors', errors);
  return (
    <Paper className={classes.paper}>
      <h1 style={{ color: "#E31B23", textAlign: "center" }}>
        Salidas de Equipo
      </h1>
      <hr className={classes.hrDivider} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          spacing={3}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={4} sm={4}>
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
                      loadVouchersCatalogAction({
                        carrierCode: value,
                        patioCode: "NLD",
                        per_page: Number.MAX_SAFE_INTEGER,
                        status: Statuses.PATIO,
                      });
                      setValue("selectedVouchers", []);
                      return setValue("carrierCode", value);
                    }}
                    options={carriers || []}
                    value={carriers && field.value ? field.value || "" : ""}
                  />
                  {errors.carrierCode && (
                    <FormHelperText error>Ingrese un Carrier</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={4} sm={4}>
            <Controller
              name="platform"
              control={control}
              render={({ field }) => (
                <FormControl className={classes.formControl}>
                  <TextField
                    {...field}
                    id="platform"
                    label="Plataforma (opcional)"
                    InputProps={{
                      autoComplete: "off",
                    }}
                    onChange={(event: any) => {
                      loadVouchersCatalogAction({
                        carrierCode,
                        patioCode: "NLD",
                        per_page: Number.MAX_SAFE_INTEGER,
                        platform: event.target.value,
                        status: Statuses.PATIO,
                      });
                      setValue("selectedVouchers", []);
                      return setValue("platform", event.target.value);
                    }}
                    value={field.value ? field.value || "" : ""}
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={4} sm={4}>
            <Controller
              name="selectedVouchers"
              control={control}
              render={({ field }) => (
                <MultipleSelect
                  options={vouchers || []}
                  field={field}
                  onChange={(e: any) => {
                    const selected = e.target.value;
                    readVoucherOutAction({ selected });
                    return setValue("selectedVouchers", selected);
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="observations"
              control={control}
              render={({ field }) => (
                <FormControl className={classes.formControlFull}>
                  <TextField
                    {...field}
                    fullWidth
                    id="observations"
                    label="Observaciones"
                    multiline
                    minRows={2}
                    maxRows={2}
                    value={field.value ? field.value || "" : ""}
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            {useMemo(
              () => (
                <BulkEdit
                  onUpdate={(value: any) => {
                    const items = value.reduce((acc, next) => {
                      const voucher = acc.find(
                        (v) => v.voucherId === next.voucher
                      );
                      const item = {
                        equipmentCode: next.equipmentCode,
                        quantity: next.quantity,
                      };
                      if (voucher) {
                        voucher.itemList.push(item);
                      } else {
                        acc.push({
                          voucherId: next.voucher,
                          itemList: [item],
                        });
                      }
                      return acc;
                    }, []);
                    setValue("itemsToReturnList", items);
                    // @todo add notification if items are empty
                    return refSubmitButtom?.current?.click();
                  }}
                  values={vouchersOut || []}
                />
              ),
              // eslint-disable-next-line react-hooks/exhaustive-deps
              [vouchersOut]
            )}
          </Grid>
        </Grid>
        <button hidden={true} ref={refSubmitButtom} type={"submit"} />
      </form>
    </Paper>
  );
};
