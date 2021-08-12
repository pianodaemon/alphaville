import React from 'react';
import clsx from 'clsx';
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Link, BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { AppRoutesContainer } from './app-routes.container';
//Icons
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import GridOnIcon from '@material-ui/icons/GridOn';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import PersonIcon from '@material-ui/icons/Person';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import Chip from '@material-ui/core/Chip';
import { useRefreshToken } from 'src/shared/hooks/use-refresh-token.hook';
// import { BreadcrumbsBar } from 'src/area/main/views/breadcrumbs.component';
import ScrollableTabsButtonAuto from 'src/area/main/views/menu.component';

type Props = {
  // logoutAction: Function,
  // refreshTokenAuthAction: Function,
  // isLoggedIn: boolean,
  // checked: boolean,
  // refreshing: boolean,
  // username: string,
};

const customHistory = createBrowserHistory();
const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    toolbar: {
      justifyContent: 'space-between',
    },
    appBar: {
      background: 'linear-gradient(135deg, #FFF 50%, #e31b23 50% 90%)',
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuAndImage: {
      display: 'flex',
      alignItems: 'center',
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      backgroundImage: 'url(/NuevoleonB.jpg)',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPositionX: '-170px',
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
      background: '#5232C2',
      '& button': {
        color: '#FFF',
      },
    },
    drawerHeaderMargin: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      // marginLeft: -drawerWidth,
      overflowX: 'auto',
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    imageLogo: {
      height: 'auto',
      width: '75%',
    },
    imageGobMx: {
      height: '6em',
      width: 'auto',
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  }),
);

export function AppBarComponent(props: Props) {
  // const { checked, isLoggedIn, logoutAction, refreshing, refreshTokenAuthAction, username } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openProfileMenu = Boolean(anchorEl);

  
  useRefreshToken((isAuthenticated: boolean, canRefresh: boolean) => {
    if (isAuthenticated) {
      // Token is close to expiry, then try to refresh
      // Token has expired, logout
      // return canRefresh ? refreshTokenAuthAction() : logoutAction({history: customHistory});
      return null;
    }
    /*
    // @todo de-authenticate use case
    if (checked && !isAuthenticated) {
      logoutAction({history: customHistory});
    }
    */
  }, []);

  const breadcrumbNameMap: { [key: string]: { [key: string]: any } } = {
    audit: {
      url: '/audit/list',
      text: 'Auditorías',
      icon: <AccountBalanceIcon />,
      open: true,
    },
    dependency: {
      url: '/dependency/list',
      text: 'Dependencias',
      icon: <AccountBalanceIcon />,
      open: true,
    },
    socialProgram: {
      url: '/social-program/list',
      text: 'Programas Sociales',
      icon: <AccountBalanceIcon />,
      open: true,
    },
    observationSfp: {
      url: '/observation-sfp/list',
      text: 'Observaciones SFP',
      icon: <ImageSearchIcon />,
      open: true,
    },
    observationAsf: {
      url: '/observation-asf/list',
      text: 'Observaciones Preliminares ASF',
      icon: <DeveloperBoardIcon />,
      open: true,
    },
    resultsReport: {
      url: '/results-report/list',
      text: 'Observaciones de la ASF (Informe de Resultados)',
      icon: <ImportContactsIcon />,
      open: true,
    },
    observationAsenl: {
      url: '/observation-asenl/list',
      text: 'Observaciones Preliminares ASENL',
      icon: <DeveloperBoardIcon />,
      open: true,
    },
    resultsReportAsenl: {
      url: '/results-report-asenl/list',
      text: 'Observaciones de la ASENL (Informe de Resultados)',
      icon: <ImportContactsIcon />,
      open: true,
    },
    observationCytg: {
      url: '/observation-cytg/list',
      text: 'Observaciones Preliminares CyTG',
      icon: <DeveloperBoardIcon />,
      open: true,
    },
    resultsReportCytg: {
      url: '/results-report-cytg/list',
      text: 'Observaciones de la CYTG (Informe de Resultados)',
      icon: <ImportContactsIcon />,
      open: true,
    },
    reports: {
      url: '/reports-52',
      text: 'Reportes',
      icon: <LibraryBooksIcon />,
      open: true,
      childrenList: [
        {
          url: '/reports-52',
          text: 'Total Informe de Resultados',
          icon: <GridOnIcon />,
        },
        {
          url: '/reports-53',
          text: 'Informe de Resultados',
          icon: <GridOnIcon />,
        },
        {
          url: '/reports-54',
          text: 'Informe Preliminar',
          icon: <GridOnIcon />,
        },
        {
          url: '/reports-55',
          text: 'Atendidas y Por Atender',
          icon: <GridOnIcon />,
        },
        {
          url: '/reports-56',
          text: 'Pendientes de Solventar',
          icon: <GridOnIcon />,
        },
        {
          url: '/reports-57',
          text: 'Observaciones por su Tipo',
          icon: <GridOnIcon />,
        },
        {
          url: '/reports-58',
          text: 'Observaciones por su Clasificación',
          icon: <GridOnIcon />,
        },
        {
          url: '/reports-59',
          text: 'Obras Públicas',
          icon: <GridOnIcon />,
        },
        {
          url: '/reports-61',
          text: 'Reporte de Detalle',
          icon: <GridOnIcon />,
        },
        {
          url: '/reports-63',
          text: 'Reporte de Detalle (No montos)',
          icon: <GridOnIcon />,
        },
      ],
    },
    user: {
      url: '/user/list',
      text: 'Usuarios',
      icon: <PersonIcon />,
      open: false,
    },
  };

  const [menuItems, setMenuItemOpen] = React.useState<{[key: string]: boolean}>(
    Object.keys(breadcrumbNameMap).reduce((acc, next) => {
      return { ...acc, [next]: !!breadcrumbNameMap[next].open }
    }, {})
  );

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar className={classes.toolbar}>
          <div className={classes.menuAndImage}>
            {(true && true) && false && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            )}
            <img className={classes.imageGobMx} src="/images/logo.png" alt="Inicio" />
          </div>
          {/*
          <div>
            {(!true && true) && <Button onClick={() => customHistory.push('/sign-in')} color="inherit">ACCEDER</Button>}
            {true && (
            <>
              <Chip
                label={'username'}
                color="primary"
                icon={<AccountCircle />}
                onClick={handleMenu}
              />
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={openProfileMenu}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    // logoutAction({history: customHistory});
                    handleClose();
                  }}
                >
                  Terminar Sesión
                </MenuItem>
              </Menu>
            </>
            )}
            </div>
            */}
        </Toolbar>
      </AppBar>
      <BrowserRouter>
        <ScrollableTabsButtonAuto />
        <AppRoutesContainer />
        {/*
        {(isLoggedIn && checked) && <BreadcrumbsBar />}
        */}
      </BrowserRouter>
    </div>
  );
}
