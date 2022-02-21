import React, { useEffect } from "react";
// import { History } from 'history';
import { Switch, Route, Redirect /*useRouteMatch*/ } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { NotFound } from "./not-found.component";
// import { Unauthorized } from './unauthorized.component';
// import { TabPanelMenu } from './home-screen.component';
import { CatalogsContainer } from "src/area/catalogs/views/catalogs.container";
import { StartPage } from "src/area/main/views/start-page.component";
import { LoginFormContainer } from "src/area/auth/views/login-form.container";
import { UsersTableContainer } from "src/area/users/views/users-table.container";
import { UsersFormContainer } from "src/area/users/views/users-form.container";
import { PatiosTableContainer } from "src/area/patios/views/patios-table.container";
import { PatiosFormContainer } from "src/area/patios/views/patio-form.container";
import { EquipmentsTableContainer } from "src/area/equipments/views/equipments-table.container";
import { EquipmentsFormContainer } from "src/area/equipments/views/equipment-form.container";
import { UnitsTableContainer } from "src/area/units/views/units-table.container";
import { UnitsFormContainer } from "src/area/units/views/unit-form.container";
import { CarriersTableContainer } from "src/area/carriers/views/carriers-table.container";
import { CarriersFormContainer } from "src/area/carriers/views/carrier-form.container";
import { VourcherFormContainer } from "src/area/vouchers/views/voucher-form.container";
import { ProcessContainer } from "src/area/catalogs/views/process.container";
import { VouchersTableContainer } from "src/area/vouchers/views/vouchers-table.container";
import { InNoutContainer } from "src/area/in-n-out/views/in-n-out.container";
import { OutContainer } from "src/area/in-n-out/views/out.container";
import { VourcherPdfContainer } from "src/area/vouchers/views/voucher-pdf.container";

// import { UsersFormContainer } from 'src/area/patios/views/patios-form.container';
// import { PERMISSIONS } from 'src/shared/constants/permissions.contants';

type Props = {
  // history: History,
  checkAuthAction: Function;
  isLoggedIn: boolean;
  checked: boolean;
  // isAllowed: Function,
};

type CustomRoute = {
  props: {
    path: Array<string> | string;
    exact?: boolean;
  };
  component: JSX.Element | null;
  app?: string;
};

const routes: Array<CustomRoute> = [
  {
    props: {
      path: ["/"],
      exact: true,
    },
    component: <StartPage />,
  },
  {
    props: {
      path: ["/start"],
      exact: true,
    },
    component: <StartPage />,
  },
  {
    props: {
      path: ["/users"], // /user/list
      exact: true,
    },
    component: <UsersTableContainer />,
    app: "USR",
  },
  {
    props: {
      path: ["/user/:action(create)", "/user/:id/:action(edit)"],
      exact: true,
    },
    component: <UsersFormContainer />,
    app: "USR",
  },
  {
    props: {
      path: ["/patios"],
      exact: true,
    },
    component: <PatiosTableContainer />,
    app: "USR",
  },
  {
    props: {
      path: ["/patio/create", "/patio/:id/:action(edit|view)"],
      exact: true,
    },
    component: <PatiosFormContainer />,
    app: "USR",
  },
  {
    props: {
      path: ["/equipments"],
      exact: true,
    },
    component: <EquipmentsTableContainer />,
    app: "USR",
  },
  {
    props: {
      path: ["/equipment/create", "/equipment/:id/:action(edit|view)"],
      exact: true,
    },
    component: <EquipmentsFormContainer />,
    app: "USR",
  },
  {
    props: {
      path: ["/units"],
      exact: true,
    },
    component: <UnitsTableContainer />,
    app: "USR",
  },
  {
    props: {
      path: ["/unit/create", "/unit/:id/:action(edit|view)"],
      exact: true,
    },
    component: <UnitsFormContainer />,
    app: "USR",
  },
  {
    props: {
      path: ["/carriers"],
      exact: true,
    },
    component: <CarriersTableContainer />,
    app: "USR",
  },
  {
    props: {
      path: ["/carrier/create", "/carrier/:id/:action(edit|view)"],
      exact: true,
    },
    component: <CarriersFormContainer />,
    app: "USR",
  },
  {
    props: {
      path: [
        "/voucher/:action(create)",
        "/voucher/:id/:action(edit|view|forward)",
      ],
      exact: true,
    },
    component: <VourcherFormContainer />,
    app: "USR",
  },
  {
    props: {
      path: ["/voucher/:id/:action(pdf)"],
      exact: true,
    },
    component: <VourcherPdfContainer />,
    app: "USR",
  },
  {
    props: {
      path: ["/vouchers"],
      exact: true,
    },
    component: <VouchersTableContainer />,
    app: "USR",
  },
  {
    props: {
      path: ["/catalogs"],
      exact: true,
    },
    component: <CatalogsContainer />,
  },
  {
    props: {
      path: ["/process"],
      exact: true,
    },
    component: <ProcessContainer />,
  },
  {
    props: {
      path: ["/processes/list", "/processes/:id/edit"],
      exact: true,
    },
    component: <NotFound />,
  },
  {
    props: {
      path: ["/in-n-out/"],
      exact: true,
    },
    component: <InNoutContainer />,
  },
  {
    props: {
      path: ["/out/"],
      exact: true,
    },
    component: <OutContainer />,
  },
  {
    props: {
      path: "/sign-in",
      exact: true,
    },
    component: <Redirect to="/menu" />,
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
      position: "fixed",
      // display: 'flex',
      width: "100%",
      justifyContent: "center",
      height: "calc(100vh - 150px)",
      overflow: "auto",
    },
  })
);

export const AppRoutes = (props: Props) => {
  const { checkAuthAction, checked, isLoggedIn } = props;
  const classes = useStyles();
  useEffect(() => {
    checkAuthAction();
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
      <Switch>
        {checked && isLoggedIn ? (
          routes.map((route: CustomRoute, index: number) => {
            return (
              <Route {...route.props} key={`${index}-${route.app}`}>
                {/* hasAccess(route.app) ? route.component : <Unauthorized /> */}
                <div className={classes.content}>{route.component}</div>
              </Route>
            );
          })
        ) : (
          <>
            <Route path="*">
              <div className={classes.content}>
                <LoginFormContainer />
              </div>
            </Route>
          </>
        )}
      </Switch>
    </>
  );
};
