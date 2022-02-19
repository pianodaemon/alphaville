import React from "react";
import { useHistory /*, useParams*/ } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { CatalogCard } from "src/shared/components/catalog-card.component";
import { Routes } from "src/shared/constants/routes.contants";
import { TypeCodes } from "src/shared/constants/patio.constants";

const useStyles = makeStyles({
  root: {
    alignItems: "center",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    height: "calc(100vh - 156px)",
    justifyContent: "center",
    overflow: "auto",
  },
});

type Props = {
  userPatioTypeCode: string;
};

export const Process = (props: Props) => {
  const classes = useStyles();
  const history = useHistory();
  const { userPatioTypeCode } = props;
  const items = [
    {
      title: "Entrada de Equipo",
      imageURL: "/images/carrier.png",
      onClick: (e: React.MouseEvent<HTMLElement>) =>
        history.push(Routes.PROCESSES.VOUCHERS),
      hidden: false // hidden: userPatioTypeCode !== TypeCodes.TRANSFER,
    },
    {
      title: "Entradas a Patio y Salidas a Carretera",
      imageURL: "/images/carrier.png",
      onClick: (e: React.MouseEvent<HTMLElement>) =>
        history.push(Routes.PROCESSES.INNOUT),
      hidden: false,
    },
    {
      title: "Salidas de Equipo",
      imageURL: "/images/carrier.png",
      onClick: (e: React.MouseEvent<HTMLElement>) =>
        history.push(Routes.PROCESSES.OUT),
      hidden: userPatioTypeCode !== TypeCodes.TRANSFER,
    },
  ];
  return (
    <div className={classes.root}>
      {items.map(
        (item, index) =>
          !item.hidden && <CatalogCard {...item} index={index} key={index} />
      )}
    </div>
  );
};
