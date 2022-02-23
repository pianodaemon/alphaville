import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import HomeIcon from "@material-ui/icons/Home";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { getFormattedDate } from "src/shared/utils/format-date.util";
import { Statuses } from "src/shared/constants/voucher-statuses.constants";
import { resolveVoucherStatusTitle } from "../utils/resolve-voucher-status-title.util";
import { Voucher } from "../state/vouchers.reducer";

type Props = {
  eventList: any[];
};

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "6px 16px",
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const renderIcon = (status: string) => {
  switch (true) {
    case status === Statuses.ENTRADA:
      return (
        <TimelineDot color="secondary">
          <ArrowDownwardIcon />
        </TimelineDot>
      );
    case status === Statuses.CARRETERA:
      return (
        <TimelineDot color="primary">
          <LocalShippingIcon />
        </TimelineDot>
      );
    case status === Statuses.PATIO:
      return (
        <TimelineDot color="primary" variant="outlined">
          <HomeIcon />
        </TimelineDot>
      );
    case status === Statuses.SALIDA:
      return (
        <TimelineDot>
          <ImportExportIcon />
        </TimelineDot>
      );
    default:
      return (
        <TimelineDot color="primary">
          <LocalShippingIcon />
        </TimelineDot>
      );
  }
};

export const EventListTimeline = (props: Props) => {
  const { eventList } = props;
  const classes = useStyles();
  console.log("eventList", eventList);
  return (
    <Timeline align="alternate">
      {eventList.map((event) => (
        <TimelineItem>
          <TimelineOppositeContent>
            <Typography variant="body2" color="textSecondary">
              {getFormattedDate(event.timestamp * 1000)}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            {renderIcon(event.status)}
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Paper elevation={3} className={classes.paper}>
              <Typography variant="h6" component="h1">
                {resolveVoucherStatusTitle({
                  voucher: { status: event.status } as Voucher,
                  isPDF: true,
                })}
              </Typography>
              <Typography variant="caption">Patio</Typography>
              <Typography>{event.patioCode}</Typography>
              <br />

              <Typography variant="caption">Plataforma</Typography>
              <Typography>{event.platform}</Typography>
              <br />

              <Typography variant="caption">Unidad</Typography>
              <Typography>{event.unitCode}</Typography>
              <br />

              <Typography variant="caption">Entregó equipo</Typography>
              <Typography>{event.originUser}</Typography>
              <br />

              <Typography variant="caption">Recibió equipo</Typography>
              <Typography>{event.targetUser}</Typography>
              <br />
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};
