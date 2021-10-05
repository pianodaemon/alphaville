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
    overflow: "auto",
  },
});

export const Catalogs = () => {
  const classes = useStyles();
  const history = useHistory();
  const items = [
    {
      title: "Carriers",
      imageURL: "/images/carrier.png",
      onClick: (e: React.MouseEvent<HTMLElement>) => history.push(Routes.CATALOGS.CARRIERS),
    },
    {
      title: "Equipos",
      imageURL: "/images/equipos.png",
      onClick: (e: React.MouseEvent<HTMLElement>) => history.push(Routes.CATALOGS.EQUIPMENT),
    },
    {
      title: "Patios",
      imageURL: "/images/patios.png",
      onClick: (e: React.MouseEvent<HTMLElement>) => history.push(Routes.CATALOGS.PATIOS),
    },
    {
      title: "Puestos",
      imageURL: "/images/carrier.png",
      onClick: (e: React.MouseEvent<HTMLElement>) => history.push(Routes.CATALOGS.PUESTOS),
    },
    {
      title: "Unidades",
      imageURL: "/images/carrier.png",
      onClick: (e: React.MouseEvent<HTMLElement>) => history.push(Routes.CATALOGS.UNITS),
    },
    {
      title: "Usuarios",
      imageURL: "/images/carrier.png",
      onClick: (e: React.MouseEvent<HTMLElement>) => history.push(Routes.CATALOGS.USERS),
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
