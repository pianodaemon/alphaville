import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Controller, /* useFieldArray,*/ useForm } from "react-hook-form";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
// import Checkbox from "@material-ui/core/Checkbox";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import { Typography } from "@material-ui/core";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import mxLocale from "date-fns/locale/es";
import DateFnsUtils from "@date-io/date-fns";
// import { CheckboxesGroup } from "src/shared/components/select-multiple.component";
// import { CustomDatePicker } from "src/shared/components/custom-date-picker.component";
import { Voucher } from "../state/vouchers.reducer";
import Table from "./table.component";

type Props = {
  createVoucherAction: Function;
  readVoucherAction: Function;
  updateVoucherAction: Function;
  loadEquipmentsCatalogAction: Function;
  loadCarriersCatalogAction: Function;
  loadPatiosCatalogAction: Function;
  loadUnitsCatalogAction: Function;
  loadUsersAsCatalogAction: Function;
  equipments: any;
  voucher: any | null;
  carriers: any;
  patios: any;
  units: any;
  users: any;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
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
      // borderWidth: 0,
      borderColor: "#DDD",
      borderStyle: "solid",
      margin: "20px 0px",
    },
    containerLegend: {
      background: "transparent",
      display: "block",
      // margin: "0px auto",
      padding: "0 1em",
      // position: "relative",
      // textAlign: "center",
      // top: "-30px",
      width: "auto !important",
      [theme.breakpoints.down("sm")]: {
        margin: "0 auto",
        width: "auto !important",
      },
    },
    legend: {
      fontWeight: "bolder",
      color: "#E31B23",
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
    formControlFull: {
      margin: theme.spacing(1),
      minWidth: 350,
      [theme.breakpoints.up("xs")]: {
        minWidth: "100%",
        display: "flex",
      },
    },
  })
);

const schema = yup.object().shape({
  //carrierCode: yup.string().required(),
  //deliveredBy: yup.string().required(),
  //observations: yup.string().required(),
  //patioCode: yup.string().required(),
  //platform: yup.string().required(),
  //receivedBy: yup.string().required(),
  //unitCode: yup.string().required(),
});

export const VoucherForm = (props: Props) => {
  const {
    // catalog,
    createVoucherAction,
    readVoucherAction,
    updateVoucherAction,
    loadEquipmentsCatalogAction,
    loadCarriersCatalogAction,
    loadPatiosCatalogAction,
    loadUnitsCatalogAction,
    loadUsersAsCatalogAction,
    equipments,
    voucher,
    carriers,
    patios,
    units,
    users,
  } = props;
  const initialValues: Voucher = {
    carrierCode: "",
    deliveredBy: "",
    id: "",
    observations: "",
    patioCode: "",
    platform: "",
    receivedBy: "",
    unitCode: "",
    itemList: [],
  };
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    setValue,
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });
  /*
  const { fields, append, prepend, remove, swap, move, insert } =
    useFieldArray({
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "itemList", // unique name for your Field Array
      keyName: "equipmentCode", // default to "id", you can change the key name
    });
  */
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams<any>();
  useEffect(() => {
    loadUsersAsCatalogAction({
      per_page: Number.MAX_SAFE_INTEGER,
    });
    loadUnitsCatalogAction({
      per_page: Number.MAX_SAFE_INTEGER,
    });
    loadPatiosCatalogAction({
      per_page: Number.MAX_SAFE_INTEGER,
    });
    loadCarriersCatalogAction({
      per_page: Number.MAX_SAFE_INTEGER,
    });
    loadEquipmentsCatalogAction({
      per_page: Number.MAX_SAFE_INTEGER,
    });
    if (id) {
      readVoucherAction({ id, history });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (voucher) {
      reset(voucher || {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voucher]);
  const onSubmit = (fields) => {
    /*
    const releaseForm: () => void = () => setSubmitting(false);
    const fields: any = values;
    fields.access_vector = fields.access_vector.map((authId: string) =>
      Number(authId)
    );
    */
    if (id) {
      delete fields.id;
      updateVoucherAction({ id, fields, history });
    } else {
      createVoucherAction({ fields, history });
    }
  };
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={mxLocale}>
      <Paper className={classes.paper}>
        <h1 style={{ color: "#E31B23" }}>Vales</h1>
        <hr className={classes.hrDivider} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="id"
                control={control}
                render={({ field }) => (
                  <FormControl className={classes.formControl}>
                    <TextField
                      {...field}
                      id="id"
                      label="#"
                      value={field.value ? field.value || "" : ""}
                    />
                    {errors.id && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Ingrese un Número
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            {/*
            <Grid item xs={12} sm={6}>
              <Controller
                name="fecha"
                control={control}
                render={({ field }) => (
                  <FormControl className={classes.formControl}>
                    <CustomDatePicker
                      field={field}
                      label="Fecha"
                      form={{
                        setValue,
                      }}
                    />
                    {errors.fecha && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Ingrese una Contraseña
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
                    */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="platform"
                control={control}
                render={({ field }) => (
                  <FormControl className={classes.formControl}>
                    <TextField
                      {...field}
                      id="platform"
                      label="Plataforma"
                      value={field.value ? field.value || "" : ""}
                    />
                    {errors.platform && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Ingrese una Plataforma
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="carrierCode"
                control={control}
                render={({ field }) => (
                  <FormControl className={classes.formControl}>
                    <InputLabel>Compañía</InputLabel>
                    <Select
                      {...field}
                      id="carrierCode"
                      label="Compañía"
                      labelId="carrierCode"
                      // value={catalog && field.value ? field.value || "" : ""}
                    >
                      {carriers &&
                        carriers.map((item) => {
                          return (
                            <MenuItem value={item.code} key={`type-${item.id}`}>
                              {item.title}
                            </MenuItem>
                          );
                        })}
                    </Select>
                    {errors.receivedBy && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Seleccione quién recibió el equipo
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="unitCode"
                control={control}
                render={({ field }) => (
                  <FormControl className={classes.formControl}>
                    <InputLabel>Unidad</InputLabel>
                    <Select
                      {...field}
                      labelId="unitCode"
                      id="unitCode"
                      // value={field.value ? field.value || "" : ""}
                    >
                      {units &&
                        units.map((item) => {
                          return (
                            <MenuItem value={item.code} key={`type-${item.id}`}>
                              {item.code}
                            </MenuItem>
                          );
                        })}
                    </Select>
                    {errors.unitCode && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Seleccione una Unidad
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="patioCode"
                control={control}
                render={({ field }) => (
                  <FormControl className={classes.formControl}>
                    <InputLabel>Patio</InputLabel>
                    <Select
                      {...field}
                      labelId="patioCode"
                      id="patioCode"
                      // value={catalog && field.value ? field.value || "" : ""}
                    >
                      {patios &&
                        patios.map((item) => {
                          return (
                            <MenuItem value={item.code} key={`type-${item.id}`}>
                              {item.title}
                            </MenuItem>
                          );
                        })}
                    </Select>
                    {errors.patioCode && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Seleccione un Patio
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              {/*
              <fieldset className={classes.fieldset}>
                <legend
                  className={classes.containerLegend}
                  style={{ width: "335px" }}
                >
                  <Typography
                    variant="body2"
                    align="center"
                    classes={{ root: classes.legend }}
                  >
                    EQUIPO
                  </Typography>
                </legend>
              </fieldset>
              */}
              <div
                style={{
                  display: "flex",
                  maxHeight: "30vh",
                }}
              >
                <Table {...{ control, equipments, getValues, setValue }} />
              </div>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item sm={12}>
              <Controller
                name="observations"
                control={control}
                render={({ field }) => (
                  <FormControl className={classes.formControlFull}>
                    <TextField
                      {...field}
                      id="observations"
                      label="Observaciones"
                      multiline
                      minRows={5}
                      maxRows={5}
                      value={field.value ? field.value || "" : ""}
                    />
                    {errors.observations && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Ingrese una Compañía
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="deliveredBy"
                control={control}
                render={({ field }) => (
                  <FormControl className={classes.formControl}>
                    <InputLabel>Entregó Equipo</InputLabel>
                    <Select
                      {...field}
                      labelId="deliveredBy"
                      id="deliveredBy"
                      // value={catalog && field.value ? field.value || "" : ""}
                    >
                      {users &&
                        users.map((item) => {
                          return (
                            <MenuItem value={item.username} key={`type-${item.userId}`}>
                              {item.username}
                            </MenuItem>
                          );
                        })}
                    </Select>
                    {errors.deliveredBy && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Seleccione quién entregó el equipo
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="receivedBy"
                control={control}
                render={({ field }) => (
                  <FormControl className={classes.formControl}>
                    <InputLabel>Recibió Equipo</InputLabel>
                    <Select
                      {...field}
                      labelId="receivedBy"
                      id="receivedBy"
                      // value={catalog && field.value ? field.value || "" : ""}
                    >
                      {users &&
                        users.map((item) => {
                          return (
                            <MenuItem value={item.username} key={`type-${item.userId}`}>
                              {item.username}
                            </MenuItem>
                          );
                        })}
                    </Select>
                    {errors.receivedBy && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Seleccione quién recibió el equipo
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            className={classes.submitInput}
            disabled={isSubmitting}
            type="submit"
          >
            {!id ? "Crear" : "Actualizar"}
          </Button>
        </form>
      </Paper>
    </MuiPickersUtilsProvider>
  );
};
