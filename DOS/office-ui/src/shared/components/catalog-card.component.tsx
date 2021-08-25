import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles({
  "@keyframes slideRight": {
    from: { transform: "translateY(50px)", opacity: 0 },
    to: { transform: "translateY(0px)", opacity: 1 },
  },
  wrapper: {
    alignItems: "center",
    animationName: "$slideRight",
    animationDelay: (props: any) => "0." + props.index + "s",
    animationFillMode: "forwards",
    animationDuration: "0.5s",
    animationIterationCount: 1,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    opacity: 0,
    width: "300px",
  },
  circle: {
    border: "7px solid rgba(277, 27, 35, .7)",
    borderRadius: "50%",
    display: "flex",
    height: "200px",
    padding: "0.8em",
    width: "200px",
  },
  title: {
    fontWeight: "bolder",
    marginTop: "2em",
    textAlign: "center",
    textTransform: "uppercase",
    color: "#888",
  },
  image: {
    height: "100%",
    width: "auto",
  },
});

type Props = {
  imageURL: string;
  index: number;
  title: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => any;
};

export const CatalogCard = (props: Props) => {
  const { imageURL, index, onClick, title } = props;
  const classes = useStyles({ index });
  return (
    <Box
      className={classes.wrapper}
      m={1}
      onClick={(e: React.MouseEvent<HTMLElement>) =>
        onClick ? onClick(e) : () => console.log('aaaa')
      }
    >
      <Box className={classes.circle} component="span" m={1}>
        <img src={imageURL} className={classes.image} />
      </Box>
      <Typography className={classes.title}>{title}</Typography>
    </Box>
  );
};
