import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  "@keyframes pulse": {
    "0%": {
      transform: "scale(0.5)",
    },
    "50%": {
      transform: "scale(1.5)",
      boxShadow: "0 0 0 50px rgba(277, 27, 35, .0)",
    },
    "100%": {
      transform: "scale(0.5)",
      boxShadow: "0 0 0 0 rgba(277, 27, 35, .0)",
    },
  },
  root: {
    display: "flex",
    height: "calc(100vh - 150px)",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    animationName: "$pulse",
    animationFillMode: "forwards",
    animationDuration: "2.9s",
    animationIterationCount: "infinite",
    border: 'none',
    // borderRadius: '50%',
    boxShadow: "0 0 0 0 rgba(277, 27, 35, .5)",
  }
}));

export const StartPage = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <img src="/images/logo.png" alt="Logo" className={classes.logo} />
    </div>
  );
};
