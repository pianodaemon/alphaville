import React, { useEffect } from 'react';
// import { History } from 'history';
import { Switch, Route, Redirect, /*useRouteMatch*/ } from 'react-router-dom';
import {
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import { NotFound } from './not-found.component';
// import { Unauthorized } from './unauthorized.component';
// import { TabPanelMenu } from './home-screen.component';
import { CatalogsContainer } from 'src/area/catalogs/views/catalogs.container';
import { StartPage } from 'src/area/main/views/start-page.component';
import { LoginFormContainer } from 'src/area/auth/views/login-form.container';
import { UsersTableContainer } from 'src/area/users/views/users-table.container';
import { UsersFormContainer } from 'src/area/users/views/users-form.container';
import { PatiosTableContainer } from 'src/area/patios/views/patios-table.container';
import { PatiosFormContainer } from 'src/area/patios/views/patio-form.container';
import { EquipmentsTableContainer } from 'src/area/equipments/views/equipments-table.container';
import { EquipmentsFormContainer } from 'src/area/equipments/views/equipment-form.container';
import { UnitsTableContainer } from 'src/area/units/views/units-table.container';
import { UnitsFormContainer } from 'src/area/units/views/unit-form.container';
import { CarriersTableContainer } from 'src/area/carriers/views/carriers-table.container';
import { CarriersFormContainer } from 'src/area/carriers/views/carrier-form.container';
import { VourcherFormContainer } from 'src/area/vouchers/views/voucher-form.container';
import { ProcessContainer } from 'src/area/catalogs/views/process.container';
import { VouchersTableContainer } from 'src/area/vouchers/views/vouchers-table.container';
// import { UsersFormContainer } from 'src/area/patios/views/patios-form.container';
// import { PERMISSIONS } from 'src/shared/constants/permissions.contants';

type Props = {
  // history: History,
  // checkAuthAction: Function,
  // isLoggedIn: boolean,
  // checked: boolean,
  // isAllowed: Function,
};

type CustomRoute = {
  props: {
    path: Array<string> | string,
    exact?: boolean,
  },
  component: JSX.Element | null,
  app?: string,
};

const routes: Array<CustomRoute> = [
  {
    props: {
      path: ['/', ],
      exact: true,
    },
    component: <LoginFormContainer />,
  },
  {
    props: {
      path: ['/start', ],
      exact: true,
    },
    component: <StartPage />,
  },
  {
    props: {
      path: ['/users'], // /user/list
      exact: true,
    },
    component: <UsersTableContainer />,
    app: 'USR',
  },
  {
    props: {
      path: ['/user/create', '/user/:id/edit'],
      exact: true,
    },
    component: <UsersFormContainer />,
    app: 'USR',
  },
  {
    props: {
      path: ['/patios'],
      exact: true,
    },
    component: <PatiosTableContainer />,
    app: 'USR',
  },
  {
    props: {
      path: ['/patio/create', '/patio/:id/edit'],
      exact: true,
    },
    component: <PatiosFormContainer />,
    app: 'USR',
  },
  {
    props: {
      path: ['/equipments'],
      exact: true,
    },
    component: <EquipmentsTableContainer />,
    app: 'USR',
  },
  {
    props: {
      path: ['/equipment/create', '/equipment/:id/edit'],
      exact: true,
    },
    component: <EquipmentsFormContainer />,
    app: 'USR',
  },
  {
    props: {
      path: ['/units'],
      exact: true,
    },
    component: <UnitsTableContainer />,
    app: 'USR',
  },
  {
    props: {
      path: ['/unit/create', '/unit/:id/edit'],
      exact: true,
    },
    component: <UnitsFormContainer />,
    app: 'USR',
  },
  {
    props: {
      path: ['/carriers'],
      exact: true,
    },
    component: <CarriersTableContainer />,
    app: 'USR',
  },
  {
    props: {
      path: ['/carrier/create', '/carrier/:id/edit'],
      exact: true,
    },
    component: <CarriersFormContainer />,
    app: 'USR',
  },
  {
    props: {
      path: ['/voucher/create', '/voucher/:id/edit'],
      exact: true,
    },
    component: <VourcherFormContainer />,
    app: 'USR',
  },
  {
    props: {
      path: ['/vouchers',],
      exact: true,
    },
    component: <VouchersTableContainer />,
    app: 'USR',
  },
  {
    props: {
      path: ['/catalogs'],
      exact: true,
    },
    component: <CatalogsContainer />,
  },
  {
    props: {
      path: ['/process'],
      exact: true,
    },
    component: <ProcessContainer />,
  },
  {
    props: {
      path: ['/processes/list', '/processes/:id/edit'],
      exact: true,
    },
    component: <NotFound />,
  },
  {
    props: {
      path: "/sign-in",
      exact: true,
    },
    component: <Redirect to='/menu' />,
  },
  {
    props: {
      path: "*",
      exact: true,
    },
    component: <NotFound />,
  },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      top: 156,
      position: 'relative',
      // display: 'flex',
      width: '100%',
      justifyContent: 'center',
    },
  }),
);

export const AppRoutes = (props: Props) => {
  const classes = useStyles();
  useEffect(() => {
    // props.checkAuthAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // const { isAllowed } = props;
  /*
  const match: any | null = useRouteMatch([
    '/:module/:view(list|create)',
    '/:module/:id/:action(edit|view)',
  ]);
  */
  /*
  const hasAccess = (app: string | undefined) => {
    if (!app) {
      return true;
    }
    if (
      !(match && match.params && (match.params.view || match.params.action))
    ) {
      return isAllowed(app);
    }
    const { action, view } = match.params;
    const type = action || view;
    switch(type) {
      case 'create':
        return isAllowed(app, PERMISSIONS.CREATE);
      case 'list':
      case 'view':
        return isAllowed(app, PERMISSIONS.READ);
      case 'edit':
        return isAllowed(app, PERMISSIONS.UPDATE);
      default:
        return false;
    }
  };
  */
  return (
    <>
    {/* props.checked true && (
      props.isLoggedIn true ? (
      <>
        <Route path="*">
          <LoginFormContainer />
        </Route>
      </>
      ) : ( 
      */}
      <Switch>
        {routes.map((route: CustomRoute, index: number) => {
          return (
            <Route {...route.props} key={`${index}-${route.app}`}>
              {/* hasAccess(route.app) ? route.component : <Unauthorized /> */}
              <div className={classes.content}>
                {route.component}
              </div>
            </Route>
          );
        })}
      </Switch>
    </>
  );
};
