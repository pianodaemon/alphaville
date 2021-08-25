import React from "react";
import { useHistory /*, useParams*/ } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import clsx from "clsx";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import InputAdornment from "@material-ui/core/InputAdornment";
import CircularProgress from "@material-ui/core/CircularProgress";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type Props = {
  // authTokenAction: Function,
  notificationAction: Function,
  isLoading?: boolean;
  checked?: boolean;
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
    paper2: {
      padding: "38px",
      marginBottom: "25px",
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
    form: {
      '& input:not([type=checkbox]):disabled, & textarea:disabled, & div[aria-disabled="true"]':
        {
          color: theme.palette.text.primary,
          opacity: 1,
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
    textErrorHelper: { color: theme.palette.error.light, maxWidth: 350 },
    submitInput: {
      backgroundColor: "#FFFFFF",
      color: "#008aba",
      border: "1px solid #008aba",
      "&:hover": {
        background: "#008aba",
        color: "#FFF",
      },
      display: "block",
      margin: "2em auto auto",
    },
    hrDivider: {
      borderTop: 0,
      height: "1px",
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
    // @
    margin: {
      margin: theme.spacing(1),
    },
    textField: {
      backgroundColor: "#FFF",
      // width: '50ch',
      [theme.breakpoints.down("xs")]: {
        display: "flex",
        minWidth: "auto",
        width: "140px",
      },
      [theme.breakpoints.up("xs")]: {
        display: "flex",
        minWidth: "auto",
        width: "23ch",
      },
      [theme.breakpoints.up("sm")]: {
        display: "flex",
        minWidth: "200px",
        width: "50ch",
      },
    },
    progress: {
      marginLeft: "10px",
      verticalAlign: "middle",
    },
  })
);

const fakeUsers = [
  {
    username: "admin",
    passwd: "admin",
  },
  {
    username: "edwin",
    passwd: "master",
  },
];

const schema = yup.object().shape({
  username: yup
    .string()
    .required(),
  passwd: yup
    .string()
    .required()
});

export const LoginForm = (props: Props) => {
  const {
    // authTokenAction,
    // checked,
    // isLoading,
    notificationAction
  } = props;
  const classes = useStyles();
  const history = useHistory();
  // const { action } = useParams<any>();
  const initialValues = {
    username: "",
    passwd: "",
    login: "",
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
    // reset,
    // getValues,
    // setValue,
    // register,
  } = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });
  const [data, setData] = React.useState<any>({
    password: "",
    showPassword: false,
  });
  const handleClickShowPassword = () => {
    setData({ ...data, showPassword: !data.showPassword });
  };
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const onSubmit = (fields) => {
    const user = fakeUsers.find((item) => item.username === fields.username && item.passwd === fields.passwd);
    if(!user) {
      notificationAction({ message: 'Usuario o contraseña inexistentes.'});
    }

    if (user) {
      history.push("/start");
    }
  };
  return /*checked*/ true ? (
    <>
      <Paper elevation={3} className={classes.paper}>
        <>
          <h1 style={{ color: "#e31b23" }}>Iniciar sesión</h1>
          <hr className={classes.hrDivider} />
          <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <Grid container alignItems="center" direction="column">
              <Grid item xs={12}>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                    >
                      <TextField
                        {...field}
                        id="username"
                        label="Usuario"
                        type="text"
                        value={field.value ? field.value || "" : ""}
                        // onChange={() => {}}
                        placeholder="Usuario"
                        variant="outlined"
                      />
                      {errors.username && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese Usuario
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="passwd"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      className={clsx(classes.margin, classes.textField)}
                      variant="outlined"
                    >
                      <TextField
                        {...field}
                        autoComplete="on"
                        id="passwd"
                        label="Contraseña"
                        type={data.showPassword ? "text" : "password"}
                        value={field.value ? field.value || "" : ""}
                        // onChange={() => {}}
                        placeholder="Contraseña"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {data.showPassword ? (
                                  <Visibility />
                                ) : (
                                  <VisibilityOff />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                      />
                      {errors.passwd && (
                        <FormHelperText
                          error
                          classes={{ error: classes.textErrorHelper }}
                        >
                          Ingrese Contraseña
                        </FormHelperText>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
            {true && (
              <>
                <Button
                  variant="contained"
                  className={classes.submitInput}
                  disabled={false}
                  type="submit"
                  color="primary"
                >
                  {"Entrar"}
                </Button>
                {(false || false) && (
                  <CircularProgress className={classes.progress} size={20} />
                )}
              </>
            )}
          </form>
        </>
      </Paper>
    </>
  ) : null;
};
