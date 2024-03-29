import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
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
import Alert from "@material-ui/lab/Alert";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import mxLocale from "date-fns/locale/es";
import DateFnsUtils from "@date-io/date-fns";
import { add, mul } from "src/shared/utils/math/add.util";
import { NumberFormatCustom } from "src/shared/components/number-format-custom.component";
import { AutoCompleteDropdown } from "src/shared/components/autocomplete-dropdown.component";
import {
  Statuses,
  IncidenceStatuses,
} from "src/shared/constants/voucher-statuses.constants";
import { getFormattedDate } from "src/shared/utils/format-date.util";
import Table from "./table.component";
import { EventListDialog } from "./event-list-dialog.component";
import { FloatingActionButton } from "./floating-action-button.component";
import { Voucher } from "../state/vouchers.reducer";
import { resolveVoucherStatusTitle } from "../utils/resolve-voucher-status-title.util";

type Props = {
  loadStatusesAction: Function;
  createVoucherAction: Function;
  readVoucherAction: Function;
  updateVoucherAction: Function;
  loadEquipmentsCatalogAction: Function;
  loadCarriersCatalogAction: Function;
  loadPatiosCatalogAction: Function;
  loadUnitsCatalogAction: Function;
  loadUsersAsCatalogAction: Function;
  createPatioVoucherUpdateVoucherAction: Function;
  createIncidenceUpdateVoucherAction: Function;
  voucher: any | null;
  carriers: any;
  patios: any;
  patio: string;
  statuses: any;
  units: any;
  username: string;
  users: any;
  // userIsComun: { [key: string]: any };
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // flexGrow: 1,
      "& .Mui-focused input, .Mui-focused textarea": {
        backgroundColor: "rgba(63, 81, 181, 0.1)",
      },
    },
    paper: {
      padding: theme.spacing(2),
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
    formControlFull: {
      margin: theme.spacing(1),
      minWidth: 350,
      [theme.breakpoints.up("xs")]: {
        minWidth: "100%",
        display: "flex",
      },
    },
    alignRight: {
      textAlign: "right",
    },
    rootInput: {
      "& .MuiInputBase-root input": {
        color: "rgba(63, 81, 181, 1)",
        textAlign: "right",
      },
    },
  })
);

const schema = yup.object().shape({
  carrierCode: yup.string().required(),
  deliveredBy: yup.string().required(),
  observations: yup.string(),
  patioCode: yup.string().required(),
  platform: yup.string().required(),
  receivedBy: yup.string().required(),
  status: yup.string().required(),
  unitCode: yup.string().required(),
  itemList: yup
    .array()
    .test("test", "at least one item with quantity > 0", (value: any) => {
      return value && value.some((val) => val.quantity > 0);
    }),
});

export const VoucherForm = (props: Props) => {
  const {
    loadStatusesAction,
    createVoucherAction,
    readVoucherAction,
    updateVoucherAction,
    loadEquipmentsCatalogAction,
    loadCarriersCatalogAction,
    loadPatiosCatalogAction,
    loadUnitsCatalogAction,
    loadUsersAsCatalogAction,
    createPatioVoucherUpdateVoucherAction,
    createIncidenceUpdateVoucherAction,
    voucher,
    carriers,
    patios,
    patio,
    statuses,
    units,
    users,
    username,
    // userIsComun,
  } = props;
  const initialValues: Voucher = {
    carrierCode: "",
    deliveredBy: "",
    eventList: [],
    generationTime: 0,
    id: "",
    lastTouchTime: 0,
    observations: "",
    patioCode: "",
    platform: "",
    receivedBy: "",
    status: "",
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
    watch,
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });
  const watchItemList = watch("itemList");
  const watchDeliveredBy = watch("deliveredBy");
  const watchReceivedBy = watch("receivedBy");
  const watchStatus = watch("status");
  const watchUnitCode = watch("unitCode");
  const classes = useStyles();
  const history = useHistory();
  const [eventListModalOpen, setEventListModalOpen] = useState<boolean>(false);
  const { action, id } = useParams<any>();
  const viewOnlyModeOn: boolean = action === "view"; // || userIsComun.status;
  const forwardVoucher: boolean = action === "forward";
  useEffect(() => {
    loadStatusesAction({
      per_page: Number.MAX_SAFE_INTEGER,
    });
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
      readVoucherAction({ id, history, editMode: action });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    reset(
      {
        ...voucher,
        ...(action === "create"
          ? { receivedBy: username, patioCode: patio, status: Statuses.ENTRADA }
          : {}),
      } || {}
    );
    /* // @todo Add Status validations and wire to viewOnlyModeOn variable
    if (
      id &&
      voucher &&
      patio &&
      action === "forward" &&
      patio !== voucher.patioCode
    ) {
      history.push(`/voucher/${id}/view`);
    }
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patio, username, voucher]);
  const diffVoucherUnits = ({
    pristine,
    dirty,
  }: {
    pristine: Voucher;
    dirty: Voucher;
  }) => {
    return pristine.itemList
      .filter((item) => item.quantity > 0)
      .map((item) => {
        const newQuantity =
          (dirty &&
            dirty.itemList &&
            dirty.itemList.find((i) => i.equipmentCode === item.equipmentCode)
              ?.quantity) ||
          0;
        if (item.quantity > parseInt(newQuantity.toString(), 10)) {
          return {
            ...item,
            quantity:
              newQuantity === 0 ? item.quantity : item.quantity - newQuantity,
          };
        }
        return undefined;
      })
      .filter((item) => item && item.quantity !== undefined);
  };
  const onSubmit: (fields: Voucher) => void = (fields: Voucher) => {
    /* @todo implement const releaseForm: () => void = () => setSubmitting(false); */
    const diff = diffVoucherUnits({
      pristine: voucher,
      dirty: fields,
    });
    const shouldCreateNewVoucher: boolean =
      (watchStatus === Statuses.ENTRADA || watchStatus === Statuses.PATIO) &&
      diff.length > 0;
    const shouldCreateIncidence: boolean =
      watchStatus === Statuses.CARRETERA &&
      (diff.length > 0 ||
        voucher.unitCode !== watchUnitCode ||
        voucher.deliveredBy !== watchDeliveredBy);
    const filterItems = (items: any[]) => {
      return items
        .filter((item: any) => parseInt(item.quantity, 10) > 0)
        .map((item: any) => {
          return { equipmentCode: item.equipmentCode, quantity: item.quantity };
        });
    };
    if (id) {
      if (shouldCreateNewVoucher) {
        if (forwardVoucher) {
          fields.status = Statuses.CARRETERA;
        }
        fields.deliveredBy = username;
        const update = {
          ...fields,
          itemList: filterItems(fields.itemList),
        };
        const create = {
          ...fields,
          status: Statuses.PATIO,
          itemList: filterItems(diff),
        };
        // @todo This is an Orchestrated Action, which executes 2 different actions in 2 different transactions
        // this should be refactored server side to become a single transaction
        createPatioVoucherUpdateVoucherAction({ create, history, id, update });
        return;
      } else if (
        shouldCreateIncidence ||
        fields.status === Statuses.CARRETERA
      ) {
        if (forwardVoucher) {
          fields.status = Statuses.PATIO;
        }
        fields.receivedBy = username;
        fields.patioCode = patio;
      } else if (
        fields.status === Statuses.ENTRADA ||
        fields.status === Statuses.PATIO
      ) {
        if (forwardVoucher) {
          fields.status = Statuses.CARRETERA;
        }
        fields.deliveredBy = username;
      }

      if (shouldCreateIncidence) {
        const create = {
          ...fields,
          inspectedBy: username,
          operator: fields.deliveredBy,
          status: IncidenceStatuses.ABIERTA,
          itemList: filterItems(diff),
        };
        const update = {
          ...fields,
          itemList: filterItems(fields.itemList),
        };
        // @todo This is an Orchestrated Action, which executes 2 different actions in 2 different transactions
        // this should be refactored server side to become a single transaction
        createIncidenceUpdateVoucherAction({
          create,
          history,
          id,
          update,
        });
        return;
      }

      fields.itemList = filterItems(fields.itemList);
      updateVoucherAction({ id, fields, history });
    } else {
      fields.itemList = filterItems(fields.itemList);
      createVoucherAction({ fields, history });
    }
  };
  const totalUnitCost: () => number = () => {
    return watchItemList.length
      ? add(
          watchItemList.map((item: any) =>
            mul(item.quantity || 0, item.unitCost || 0)
          )
        )
      : 0;
  };
  const showTitle: () => string = () =>
    resolveVoucherStatusTitle({
      action,
      forwardVoucher,
      id,
      viewOnlyModeOn,
      voucher,
      watchStatus,
    });
  const showAlert: () => React.ReactNode = () => {
    if (!voucher || !voucher.itemList) {
      return;
    }
    const diff = diffVoucherUnits({
      pristine: voucher,
      dirty: getValues(),
    });
    if (
      (watchStatus === Statuses.ENTRADA || watchStatus === Statuses.PATIO) &&
      diff.length
    ) {
      return (
        <Alert severity="warning">
          Importante: Los cambios realizado en las cantidades de cualquier
          equipo resultarán en la generación de un nuevo "Vale para equipo
          dejado en patio".
        </Alert>
      );
    }
    if (
      watchStatus === Statuses.CARRETERA &&
      (diff.length ||
        voucher.unitCode !== watchUnitCode ||
        voucher.deliveredBy !== watchDeliveredBy)
    ) {
      return (
        <Alert severity="warning">
          Importante: Los cambios realizado en las cantidades de cualquier
          equipo, así como en los campos <em>Unidad</em> o{" "}
          <em>Entregó Equipo</em> resultarán en la generación de un nuevo{" "}
          <em>"Reporte de incidencia y/o percance"</em>.
        </Alert>
      );
    }
  };
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={mxLocale}>
      <Paper className={classes.paper}>
        <h1 style={{ color: "#E31B23", textAlign: "center" }}>{showTitle()}</h1>
        {showAlert()}
        <hr className={classes.hrDivider} />
        <form onSubmit={handleSubmit(onSubmit)} className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Controller
                name="id"
                control={control}
                render={({ field }) => (
                  <FormControl className={classes.formControl}>
                    <TextField
                      {...field}
                      disabled={viewOnlyModeOn}
                      id="id"
                      inputProps={{
                        disabled: true,
                      }}
                      label="No."
                      value={field.value ? field.value || "" : ""}
                    />
                    {errors.id && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Ingrese un ID
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="generationTime"
                control={control}
                render={({ field }) => (
                  <FormControl className={classes.formControl}>
                    <TextField
                      {...field}
                      disabled={viewOnlyModeOn}
                      id="generationTime"
                      inputProps={{ readOnly: true }}
                      label="Fecha de Creación"
                      value={
                        field.value
                          ? getFormattedDate(field.value * 1000) || ""
                          : ""
                      }
                    />
                    {errors.generationTime && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Ingrese una Fecha
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="lastTouchTime"
                control={control}
                render={({ field }) => (
                  <FormControl className={classes.formControl}>
                    <TextField
                      {...field}
                      disabled={viewOnlyModeOn}
                      id="lastTouchTime"
                      inputProps={{ readOnly: true }}
                      label="Fecha de Última Modificación"
                      value={
                        field.value
                          ? getFormattedDate(field.value * 1000) || ""
                          : ""
                      }
                    />
                    {errors.lastTouchTime && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Ingrese una Fecha
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="platform"
                control={control}
                render={({ field }) => (
                  <FormControl className={classes.formControl}>
                    <TextField
                      {...field}
                      disabled={viewOnlyModeOn}
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
            <Grid item xs={12} sm={4}>
              <Controller
                name="carrierCode"
                control={control}
                render={({ field }) => (
                  <FormControl className={classes.formControl}>
                    <InputLabel>Carrier</InputLabel>
                    <Select
                      {...field}
                      disabled={viewOnlyModeOn || action !== "create"}
                      id="carrierCode"
                      label="Carrier"
                      labelId="carrierCode"
                      value={carriers && field.value ? field.value || "" : ""}
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
                    {errors.carrierCode && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Seleccione un Carrier
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="unitCode"
                control={control}
                render={({ field }) => (
                  <FormControl className={classes.formControl}>
                    <InputLabel>Unidad</InputLabel>
                    <Select
                      {...field}
                      disabled={viewOnlyModeOn}
                      id="unitCode"
                      labelId="unitCode"
                      value={units && field.value ? field.value || "" : ""}
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
            <Grid item xs={12} sm={4}>
              <Controller
                name="patioCode"
                control={control}
                render={({ field }) => (
                  <FormControl className={classes.formControl}>
                    <InputLabel>Patio</InputLabel>
                    <Select
                      {...field}
                      // disabled={viewOnlyModeOn}
                      disabled
                      id="patioCode"
                      labelId="patioCode"
                      value={patios && field.value ? field.value || "" : ""}
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
              <div
                style={{
                  display: "flex",
                  maxHeight: "50vh",
                }}
              >
                <Table
                  {...{
                    control,
                    items: watchItemList,
                    readonly: viewOnlyModeOn,
                  }}
                />
              </div>
              {errors.itemList && (
                <FormHelperText
                  error
                  classes={{ error: classes.textErrorHelper }}
                >
                  Ingrese al menos un Equipo
                </FormHelperText>
              )}
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={4} className={classes.alignRight}>
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
                  classes={{ root: classes.rootInput }}
                  label="Total (USD)"
                  defaultValue={"100"}
                  value={watchItemList && totalUnitCost()}
                />
              </FormControl>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="observations"
                control={control}
                render={({ field }) => (
                  <FormControl className={classes.formControlFull}>
                    <TextField
                      {...field}
                      disabled={viewOnlyModeOn}
                      fullWidth
                      id="observations"
                      label="Observaciones"
                      multiline
                      minRows={2}
                      maxRows={2}
                      value={field.value ? field.value || "" : ""}
                    />
                    {errors.observations && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Ingrese Observaciones
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl className={classes.formControl}>
                <AutoCompleteDropdown
                  disabled={
                    viewOnlyModeOn ||
                    ((action === "edit" || action === "forward") &&
                      [Statuses.ENTRADA, Statuses.PATIO].indexOf(
                        voucher.status
                      ) > -1)
                  }
                  fieldLabel="displayName"
                  fieldValue="username"
                  label="Entregó Equipo"
                  name="deliveredBy"
                  onChange={(value: any) => {
                    return setValue("deliveredBy", value);
                  }}
                  options={users || []}
                  value={
                    users && watchDeliveredBy ? watchDeliveredBy || "" : ""
                  }
                />
                {errors.deliveredBy && (
                  <FormHelperText
                    error
                    classes={{ error: classes.textErrorHelper }}
                  >
                    Seleccione quién entregó el equipo
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl className={classes.formControl}>
                <AutoCompleteDropdown
                  disabled={
                    viewOnlyModeOn ||
                    action === "create" ||
                    ((action === "edit" || action === "forward") &&
                      watchStatus === Statuses.CARRETERA)
                  }
                  fieldLabel="displayName"
                  fieldValue="username"
                  label="Recibió Equipo"
                  name="receivedBy"
                  onChange={(value: any) => {
                    return setValue("receivedBy", value);
                  }}
                  options={users || []}
                  value={users && watchReceivedBy ? watchReceivedBy || "" : ""}
                />
                {errors.receivedBy && (
                  <FormHelperText
                    error
                    classes={{ error: classes.textErrorHelper }}
                  >
                    Seleccione quién recibió el equipo
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl className={classes.formControl}>
                    <InputLabel>Estatus</InputLabel>
                    <Select
                      {...field}
                      // disabled={viewOnlyModeOn}
                      disabled
                      id="status"
                      labelId="status"
                      value={statuses && field.value ? field.value || "" : ""}
                    >
                      {statuses &&
                        statuses.map((item) => {
                          return (
                            <MenuItem value={item.code} key={`type-${item.id}`}>
                              {item.title}
                            </MenuItem>
                          );
                        })}
                    </Select>
                    {errors.status && (
                      <FormHelperText
                        error
                        classes={{ error: classes.textErrorHelper }}
                      >
                        Seleccione un Estatus
                      </FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              {!viewOnlyModeOn && (
                <Button
                  variant="contained"
                  className={classes.submitInput}
                  disabled={isSubmitting}
                  type="submit"
                >
                  {!id ? "Crear" : "Actualizar"}
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
        {action !== "create" && (
          <FloatingActionButton onClick={() => setEventListModalOpen(true)} />
        )}
        <EventListDialog
          isOpen={eventListModalOpen}
          onClose={() => setEventListModalOpen(false)}
          voucher={voucher}
        />
      </Paper>
    </MuiPickersUtilsProvider>
  );
};
