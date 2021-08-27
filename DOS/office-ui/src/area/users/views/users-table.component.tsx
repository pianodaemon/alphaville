/* eslint-disable no-alert */
import React, { useEffect, /* useState */ } from "react";
import { useHistory } from "react-router-dom";
// import { User } from "src/area/users/state/users.reducer";
import MaterialTable, {
  MTableToolbar,
  MTableBody,
  // MTableFilterRow,
} from "material-table";
import TablePagination from "@material-ui/core/TablePagination";
import Button from "@material-ui/core/Button";
import PostAddIcon from "@material-ui/icons/PostAdd";
// import { PERMISSIONS } from 'src/shared/constants/permissions.contants';

import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Tooltip from "@material-ui/core/Tooltip";
import FilterListIcon from "@material-ui/icons/FilterList";

type Props = {
  // users: Array<User>,
  users: any;
  loadUsersAction: Function;
  deleteUserAction: Function,
  loading: boolean;
  paging: any;
  // isAllowed: Function,
  filters: any;
};

export const UsersTable = (props: Props) => {
  const {
    users,
    loadUsersAction,
    deleteUserAction,
    loading,
    paging /* isAllowed */,
    filters,
  } = props;
  const { count, page, per_page, order } = paging;
  const history = useHistory();
  // const [listOrder, setListOrder] = useState<string>("");
  // const customSort = () => 0;
  const customFilterAndSearch = (term: any, rowData: any) => true;
  const draggable: boolean = false;
  const sorting: boolean = false;
  const columns = [
    {
      title: "ID",
      field: "userId",
      // customSort,
      customFilterAndSearch,
      sorting: !sorting,
      filtering: false,
      defaultSort: "asc",
    },
    {
      title: "Nombre de Usuario",
      field: "username",
      sorting: !sorting,
      customFilterAndSearch,
      filtering: false,
      defaultSort: "asc",
    },
    {
      title: "Nombre",
      field: "firstName",
      sorting: !sorting,
      customFilterAndSearch,
      filtering: false,
    },
    {
      title: "Apellido",
      field: "lastName",
      sorting: !sorting,
      customFilterAndSearch,
      filtering: false,
    },
    {
      title: "Rol en la Organización",
      field: "roleId_str",
      sorting: !sorting,
      // customSort,
      customFilterAndSearch,
      // @todo Make me a reusable component, please!
      filterComponent: (props: any) => {
        const { columnDef, onFilterChanged } = props;
        return (
          <TextField
            style={columnDef.type === "numeric" ? { float: "right" } : {}}
            type={columnDef.type === "numeric" ? "number" : "search"}
            defaultValue={
              columnDef.tableData.filterValue || (filters && filters["roleId"])
            }
            // placeholder={this.getLocalizedFilterPlaceHolder(columnDef)}
            onChange={(event: any) => {
              if (!event.target.value) {
                onFilterChanged(columnDef.tableData.id, event.target.value);
                return false;
              }
            }}
            onKeyDown={(event: any) => {
              if (event.keyCode === 13) {
                onFilterChanged(columnDef.tableData.id, event.target.value);
                return false;
              }
            }}
            inputProps={{ "aria-label": `filter data by ${columnDef.title}` }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Tooltip title="filtrar por">
                    <FilterListIcon />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
        );
      },
    },
    {
      title: "Activo",
      field: "disabled",
      sorting,
      lookup: { "false": 'Sí', "true": 'No' },
    },
  ];
  const getColumnNameByIndex = (columnId: number) =>
    columns.map((column) => column.field)[columnId];
  useEffect(() => {
    loadUsersAction({ per_page: paging.per_page, order });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <MaterialTable
      title=""
      onOrderChange={(orderBy: number, orderDirection: "asc" | "desc") => {
        console.log(orderBy, orderDirection);
        loadUsersAction({
          //...paging,
          order: orderDirection,
          order_by: getColumnNameByIndex(orderBy),
        });
      }}
      columns={columns as any}
      data={users || []}
      options={{
        draggable,
        initialPage: 1, // @todo include this settings value in a CONSTANTS file
        paging: true,
        pageSize: per_page,
        thirdSortClick: false,
        actionsColumnIndex: columns.length, // @todo this shouldn't be hardcoded, calculate using columns.lenght
        filtering: true,
      }}
      components={{
        // FilterRow: props => <><MTableFilterRow {...props}  /><div>asassa</div></>,
        Pagination: (componentProps) => {
          return (
            <TablePagination
              {...componentProps}
              count={count}
              page={page - 1 || 0}
              rowsPerPage={per_page}
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              onChangePage={(event, currentPage: number) => {
                loadUsersAction({
                  per_page,
                  page: currentPage + 1,
                  order,
                  // offset: nextPage * 1,
                  filters,
                });
              }}
              onChangeRowsPerPage={(event: any) => {
                componentProps.onChangeRowsPerPage(event);
                loadUsersAction({
                  per_page: event.target.value,
                });
              }}
            />
          );
        },
        Toolbar: (componentProps) => {
          return (
            <div>
              <MTableToolbar {...componentProps} />
              <div style={{ padding: "0px 10px", textAlign: "right" }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PostAddIcon />}
                  size="medium"
                  onClick={() => history.push("/user/create")}
                >
                  Agregar Usuario
                </Button>
              </div>
            </div>
          );
        },
        Body: (bodyProps) => (
          <MTableBody
            {...bodyProps}
            onFilterChanged={(columnId: number, value: string) => {
              // console.log(columnId, value, getColumnNameByIndex(columnId));
              bodyProps.onFilterChanged(columnId, value);
              loadUsersAction({
                filters: {
                  ...filters,
                  [getColumnNameByIndex(columnId)]: value,
                },
              });
            }}
          />
        ),
      }}
      actions={[
        {
          icon: "edit",
          tooltip: "Editar Usuario",
          onClick: (event, rowData: any) =>
            history.push(`/user/${rowData.id}/edit`),
          // disabled: !isAllowed('USR', PERMISSIONS.UPDATE),
        },
        {
          icon: "delete",
          tooltip: "Eliminar Usuario",
          onClick: (event, rowData: any) => {
            if (
              // eslint-disable-next-line no-restricted-globals
              confirm(
                `¿Realmente quieres eliminar el Usuario ${rowData.id}?\n Esta acción es irreversible`
              )
            ) {
              deleteUserAction(rowData.id);
            }
          },
          // disabled: !isAllowed('USR', PERMISSIONS.DELETE),
        },
      ]}
      isLoading={loading}
    />
  );
};
