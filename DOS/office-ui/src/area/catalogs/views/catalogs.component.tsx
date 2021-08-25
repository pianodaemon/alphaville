import React from "react";
import { CatalogCard } from "src/shared/components/catalog-card.component";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory /*, useParams*/ } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#fff",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    height: 'calc(100vh - 156px)'
  },
});

export const Catalogs = () => {
  const classes = useStyles();
  const history = useHistory();
  const items = [
    {
      title: "Carriers",
      imageURL: "/images/carrier.png",
      onClick: (e: React.MouseEvent<HTMLElement>) => history.push('/carriers'),
    },
    {
      title: "Unidades",
      imageURL: "/images/carrier.png",
      onClick: (e: React.MouseEvent<HTMLElement>) => history.push('/units'),
    },
    {
      title: "Patios",
      imageURL: "/images/carrier.png",
      onClick: (e: React.MouseEvent<HTMLElement>) => history.push('/patios'),
    },
    {
      title: "Equipos",
      imageURL: "/images/carrier.png",
      onClick: (e: React.MouseEvent<HTMLElement>) => history.push('/equipments'),
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
