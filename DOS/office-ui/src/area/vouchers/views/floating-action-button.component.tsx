import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import TimelineIcon from "@material-ui/icons/Timeline";

type Props = {
  onClick: Function;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
      position: "fixed",
    },
  })
);

export const FloatingActionButton = (props: Props) => {
  const { onClick } = props;
  const classes = useStyles();
  const handleClick = (event: React.SyntheticEvent | React.MouseEvent) => {
    onClick();
  };

  return (
    <Fab
      color="secondary"
      aria-label="add"
      className={classes.fab}
      onClick={handleClick}
    >
      <TimelineIcon />
    </Fab>
  );
};
