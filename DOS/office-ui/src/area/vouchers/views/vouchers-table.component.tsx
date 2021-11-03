/* eslint-disable no-alert */
import React, { useEffect, useReducer } from "react";
import { useHistory } from "react-router-dom";
import MaterialTable, {
  MTableToolbar,
  MTableBody,
  // MTableFilterRow,
} from "material-table";
import TablePagination from "@material-ui/core/TablePagination";
import Button from "@material-ui/core/Button";
import PostAddIcon from "@material-ui/icons/PostAdd";
import { Statuses } from "src/shared/constants/voucher-statuses.constants";
// import { PERMISSIONS } from 'src/shared/constants/permissions.contants';

/*
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Tooltip from "@material-ui/core/Tooltip";
import FilterListIcon from "@material-ui/icons/FilterList";
*/

type Props = {
  deleteVoucherAction: Function;
  filters: any;
  // isAllowed: Function,
  loadStatusesAction: Function;
  loadUsersAsCatalogAction: Function;
  loadVouchersAction: Function;
  loading: boolean;
  paging: any;
  vouchers: any;
};

function reducer(state, action) {
  const { orderBy, orderDirection } = action.payload;
  switch (action.type) {
    case "reorder":
      return state.map((column, index) => {
        if (index !== orderBy) {
          delete column.defaultSort;
        } else {
          column.defaultSort = orderDirection;
        }
        return column;
      });
    default:
      throw new Error();
  }
}

export const ValesTable = (props: Props) => {
  const {
    deleteVoucherAction,
    filters,
    // isAllowed,
    loadStatusesAction,
    loadUsersAsCatalogAction,
    loadVouchersAction,
    loading,
    paging,
    vouchers,
  } = props;
  const { count, page, per_page, order } = paging;
  const history = useHistory();
  const columns = [
    {
      title: "ID",
      field: "id",
      // customFilterAndSearch,
      filtering: false,
      sorting: true,
      defaultSort: "desc",
    },
    {
      title: "Compañía",
      field: "carrierCode",
      filtering: false,
      defaultSort: "desc",
      sorting: true,
    },
    {
      title: "Plataforma",
      field: "platform",
      filtering: false,
    },
    {
      title: "Unidad",
      field: "unitCode",
      filtering: false,
    },
    {
      title: "Patio",
      field: "patioCode",
      filtering: false,
    },
    {
      title: "Entregó equipo",
      field: "deliveredBy",
      filtering: false,
    },
    {
      title: "Recibió equipo",
      field: "receivedBy",
      filtering: false,
    },
    {
      title: "Estatus",
      field: "status",
      filtering: false,
    },
  ];
  const [state, dispatch] = useReducer(reducer, columns);
  const getColumnNameByIndex = (columnId: number): string | any =>
    state.map((column) => column.field)[columnId];
  const canEdit = (status): boolean => {
    return ![Statuses.ENTRADA].includes(status);
  };
  useEffect(() => {
    loadUsersAsCatalogAction({ per_page: Number.MAX_SAFE_INTEGER });
    loadVouchersAction({ per_page: paging.per_page, order });
    loadStatusesAction({ per_page: Number.MAX_SAFE_INTEGER });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <MaterialTable
      title="Vales"
      onOrderChange={(orderBy: number, orderDirection: "asc" | "desc") => {
        dispatch({ type: "reorder", payload: { orderBy, orderDirection } });
        loadVouchersAction({
          //...paging,
          order: orderDirection,
          order_by: getColumnNameByIndex(orderBy),
        });
      }}
      columns={
        [
          ...state.map((item) => {
            return { ...item };
          }),
        ] as any
      }
      data={vouchers || []}
      options={{
        draggable: false,
        initialPage: 1, // @todo include this settings value in a CONSTANTS file
        paging: true,
        pageSize: per_page,
        thirdSortClick: false,
        actionsColumnIndex: state.length, // @todo this shouldn't be hardcoded, calculate using columns.lenght
        filtering: true,
        sorting: true,
        loadingType: "overlay",
        rowStyle: (_data: any, index: number, _level: number) => {
          return index % 2 ? { backgroundColor: "rgba(227,27,35,0.1)" } : {};
        },
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
                loadVouchersAction({
                  per_page,
                  page: currentPage + 1,
                  order,
                  // offset: nextPage * 1,
                  filters,
                });
              }}
              onChangeRowsPerPage={(event: any) => {
                componentProps.onChangeRowsPerPage(event);
                loadVouchersAction({
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
                  onClick={() => history.push("/voucher/create")}
                >
                  Agregar Vale
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
              loadVouchersAction({
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
          icon: "print",
          tooltip: "Imprimir",
          onClick: (event, rowData: any) =>
            history.push(`/voucher/${rowData.id}/edit`),
          // disabled: !isAllowed('USR', PERMISSIONS.UPDATE),
        },
        {
          icon: "search",
          tooltip: "Visualizar Vale",
          onClick: (event, rowData: any) =>
            history.push(`/voucher/${rowData.id}/view`),
          // disabled: !isAllowed('ASER', PERMISSIONS.READ),
        },
        (rowData) => ({
          icon: "edit",
          tooltip: "Editar",
          onClick: () => history.push(`/voucher/${rowData.id}/edit`),
          disabled: canEdit(rowData.stat),
        }),
        {
          icon: "delete",
          tooltip: "Eliminar Usuario",
          onClick: (event, rowData: any) => {
            if (
              // eslint-disable-next-line no-restricted-globals
              confirm(
                `¿Realmente quieres eliminar el Voucher ${rowData.id}?\n Esta acción es irreversible`
              )
            ) {
              deleteVoucherAction(rowData.id);
            }
          },
          // disabled: !isAllowed('USR', PERMISSIONS.DELETE),
        },
      ]}
      isLoading={loading}
    />
  );
};
