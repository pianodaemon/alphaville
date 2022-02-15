import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CheckboxesGroup } from "src/shared/components/select-multiple.component";
import { Catalog, User } from "../state/users.reducer";

type Props = {
  createUserAction: Function;
  readUserAction: Function;
  updateUserAction: Function;
  loadUsersCatalogAction: Function;
  catalog: Catalog | null;
  user: User | null;
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
  })
);

const schema = yup.object().shape({
  username: yup
    .string()
    .matches(/^[a-zA-Z0-9_-]*$/, "Format error")
    .required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  disabled: yup.boolean(),
});

export const UserForm = (props: Props) => {
  const {
    catalog,
    createUserAction,
    readUserAction,
    updateUserAction,
    loadUsersCatalogAction,
    user,
  } = props;
  const initialValues = {
    username: "",
    passwd: "",
    firstName: "",
    lastName: "",
    disabled: false,
    roleId: 0,
    authorities: [],
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });
  const classes = useStyles();
  const history = useHistory();
  const { action, id } = useParams<any>();
  const isEditing = action === "edit";
  useEffect(() => {
    loadUsersCatalogAction();
    if (id) {
      readUserAction({ id, history });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      reset(user || {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
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
      updateUserAction({ id, fields, history /* releaseForm */ });
    } else {
      createUserAction({ fields, history /* releaseForm */ });
    }
  };
  return (
    <Paper className={classes.paper}>
      <h1 style={{ color: "#128aba" }}>Usuarios</h1>
      <hr className={classes.hrDivider} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <FormControl className={classes.formControl}>
                  <TextField
                    {...field}
                    disabled={isEditing}
                    id="username"
                    label="Nombre del Usuario"
                    value={field.value ? field.value || "" : ""}
                  />
                  {errors.username && (
                    <FormHelperText
                      error
                      classes={{ error: classes.textErrorHelper }}
                    >
                      Ingrese una Nombre de Usuario válido (Admitidos letras
                      mayúsculas, minúsculas, números y guiones)
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="passwd"
              control={control}
              render={({ field }) => (
                <FormControl className={classes.formControl}>
                  <TextField
                    {...field}
                    id="passwd"
                    label="Contraseña"
                    value={field.value ? field.value || "" : ""}
                  />
                  {errors.passwd && (
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
          <Grid item xs={12} sm={6}>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <FormControl className={classes.formControl}>
                  <TextField
                    {...field}
                    id="firstName"
                    label="Nombre"
                    value={field.value ? field.value || "" : ""}
                  />
                  {errors.firstName && (
                    <FormHelperText
                      error
                      classes={{ error: classes.textErrorHelper }}
                    >
                      Ingrese un Nombre
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <FormControl className={classes.formControl}>
                  <TextField
                    {...field}
                    id="lastName"
                    label="Apellido"
                    value={field.value ? field.value || "" : ""}
                  />
                  {errors.lastName && (
                    <FormHelperText
                      error
                      classes={{ error: classes.textErrorHelper }}
                    >
                      Ingrese un Apellido
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="disabled"
              control={control}
              render={({ field }) => (
                <FormControl className={classes.formControl}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        color="primary"
                        // checked={values.disabled || false}
                        // onChange={handleChange("disabled")}
                        checked={field.value ? field.value || false : false}
                      />
                    }
                    label="Desactivado"
                  />
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="roleId"
              control={control}
              render={({ field }) => (
                <FormControl className={classes.formControl}>
                  <InputLabel>Rol</InputLabel>
                  <Select
                    {...field}
                    labelId="roleId"
                    id="roleId"
                    // value={catalog && field.value ? field.value || "" : ""}
                    value={catalog && field.value ? field.value || "" : ""}
                  >
                    {catalog &&
                      catalog.roleList &&
                      catalog.roleList.map((item) => {
                        return (
                          <MenuItem value={item.id} key={`type-${item.id}`}>
                            {item.title}
                          </MenuItem>
                        );
                      })}
                  </Select>
                  {errors.roleId && (
                    <FormHelperText
                      error
                      classes={{ error: classes.textErrorHelper }}
                    >
                      Seleccione un Rol
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CheckboxesGroup
              control={control}
              getValues={getValues}
              name="authorities"
              options={(catalog && catalog.authorityList) || []}
              setValue={setValue}
              title="Permisos"
            />
            {errors.authorities && (
              <FormHelperText
                error
                classes={{ error: classes.textErrorHelper }}
              >
                Ingrese al menos un permiso
              </FormHelperText>
            )}
          </Grid>
        </Grid>

        <Button
          variant="contained"
          className={classes.submitInput}
          disabled={/*isSubmitting*/ false}
          type="submit"
        >
          {!id ? "Crear" : "Actualizar"}
        </Button>
      </form>
    </Paper>
  );
};
