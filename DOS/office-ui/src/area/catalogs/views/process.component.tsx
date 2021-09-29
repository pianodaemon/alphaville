import React from "react";
import { CatalogCard } from "src/shared/components/catalog-card.component";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory /*, useParams*/ } from "react-router-dom";
import { Routes } from 'src/shared/constants/routes.contants';

const useStyles = makeStyles({
  root: {
    alignItems: "center",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    height: 'calc(100vh - 156px)',
    justifyContent: "center",
    overflow: "scroll",
  },
});

export const Process = () => {
  const classes = useStyles();
  const history = useHistory();
  const items = [
    {
      title: "Vales",
      imageURL: "/images/carrier.png",
      onClick: (e: React.MouseEvent<HTMLElement>) => history.push(Routes.PROCESSES.VOUCHERS),
    },
  ];
  return (
    <div className={classes.root}>
      {items.map((item, index) => (
        <CatalogCard {...item} index={index} key={index} />
      ))}
    </div>
  );
};
