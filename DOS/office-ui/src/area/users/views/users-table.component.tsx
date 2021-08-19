import { useEffect } from 'react';
import {
  DataGrid,
  GridColDef,
  // GridValueGetterParams,
  GridOverlay,
  GridToolbar,
  // GridFooter,
} from "@material-ui/data-grid";
import LinearProgress from '@material-ui/core/LinearProgress';

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

type Props = {
  // users: Array<User>,
  users: any,
  loadUsersAction: Function,
  // removeUserAction: Function,
  loading: boolean,
  // paging: any,
  // isAllowed: Function,
};

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
    width: 100
  },
  {
    field: "username",
    headerName: "Usuario",
    width: 150,
    editable: false,
  },
  {
    field: "firstName",
    headerName: "Nombre",
    width: 150,
    editable: false,
  },
  {
    field: "lastName",
    headerName: "Apellidos",
    width: 150,
    editable: false,
  },
  {
    field: "roleId",
    headerName: "Rol",
    type: "string",
    width: 110,
    editable: false,
  },
  /*
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.getValue(params.id, "firstName") || ""} ${
        params.getValue(params.id, "lastName") || ""
      }`,
  },
  */
];

export const UsersTable = (props: Props) => {
  const { loadUsersAction, users, loading } = props;
  useEffect(() => {
    loadUsersAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        components={{
          LoadingOverlay: CustomLoadingOverlay,
          Toolbar: GridToolbar,
          // Footer: CustomLoadingOverlay2,
        }}
        loading={loading}
        rows={users || []}
        columns={columns}
        pageSize={100}
        rowsPerPageOptions={[5, 10, 15, 20, 50, 100]}
        checkboxSelection
        // disableSelectionOnClick
        paginationMode="server"
        sortingMode="server"
      />
    </div>
  );
}
