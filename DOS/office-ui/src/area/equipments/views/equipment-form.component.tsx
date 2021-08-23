import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Equipment } from "../state/equipments.reducer";

type Props = {
  createEquipmentAction: Function;
  readEquipmentAction: Function;
  updateEquipmentAction: Function;
  equipment: Equipment | null;
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
  code: yup.string().required(),
  title: yup.string().required(),
});

export const EquipmentForm = (props: Props) => {
  const {
    createEquipmentAction,
    readEquipmentAction,
    updateEquipmentAction,
    equipment,
  } = props;
  const initialValues = {
    code: "",
    title: "",
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams<any>();
  useEffect(() => {
    if (id) {
      readEquipmentAction({ id, history });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (equipment) {
      reset(equipment || {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equipment]);
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
      updateEquipmentAction({ id, fields, history /* releaseForm */ });
    } else {
      createEquipmentAction({ fields, history /* releaseForm */ });
    }
  };
  return (
    <Paper className={classes.paper}>
      <h1 style={{ color: "#128aba" }}>Equipos</h1>
      <hr className={classes.hrDivider} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <FormControl className={classes.formControl}>
                  <TextField
                    {...field}
                    id="code"
                    label="Clave"
                    value={field.value ? field.value || "" : ""}
                  />
                  {errors.code && (
                    <FormHelperText
                      error
                      classes={{ error: classes.textErrorHelper }}
                    >
                      Ingrese una Clave
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <FormControl className={classes.formControl}>
                  <TextField
                    {...field}
                    id="title"
                    label="Descripción"
                    value={field.value ? field.value || "" : ""}
                  />
                  {errors.title && (
                    <FormHelperText
                      error
                      classes={{ error: classes.textErrorHelper }}
                    >
                      Ingrese un Descripción
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
          disabled={/*isSubmitting*/ false}
          type="submit"
        >
          {!id ? "Crear" : "Actualizar"}
        </Button>
      </form>
    </Paper>
  );
};
