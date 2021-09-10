/* eslint-disable no-alert */
import React, { useEffect /* useState */ } from "react";
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

/*
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Tooltip from "@material-ui/core/Tooltip";
import FilterListIcon from "@material-ui/icons/FilterList";
*/

type Props = {
  vouchers: any;
  loadVouchersAction: Function;
  deleteVoucherAction: Function;
  loading: boolean;
  paging: any;
  // isAllowed: Function,
  filters: any;
};

export const ValesTable = (props: Props) => {
  const {
    vouchers,
    loadVouchersAction,
    deleteVoucherAction,
    loading,
    paging,
    // isAllowed,
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
      field: "id",
      // customSort,
      customFilterAndSearch,
      sorting: !sorting,
      filtering: false,
      defaultSort: "asc",
    },
    {
      title: "Compañía",
      field: "carrierCode",
      sorting: !sorting,
      customFilterAndSearch,
      filtering: false,
    },
    {
      title: "Plataforma",
      field: "platform",
      sorting: !sorting,
      customFilterAndSearch,
      filtering: false,
      defaultSort: "asc",
    },
    {
      title: "Unidad",
      field: "unitCode",
      sorting: !sorting,
      customFilterAndSearch,
      filtering: false,
    },
    {
      title: "Patio",
      field: "patioCode",
      sorting: !sorting,
      // customSort,
      customFilterAndSearch,
      filtering: false,
    },
    {
      title: "Entregó equipo",
      field: "deliveredBy",
      sorting: !sorting,
      // customSort,
      customFilterAndSearch,
      filtering: false,
    },
    {
      title: "Recibió equipo",
      field: "receivedBy",
      sorting: !sorting,
      // customSort,
      customFilterAndSearch,
      filtering: false,
    },
  ];
  const getColumnNameByIndex = (columnId: number) =>
    columns.map((column) => column.field)[columnId];
  useEffect(() => {
    loadVouchersAction({ per_page: paging.per_page, order });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <MaterialTable
      title="Vales"
      onOrderChange={(orderBy: number, orderDirection: "asc" | "desc") => {
        console.log(orderBy, orderDirection);
        loadVouchersAction({
          //...paging,
          order: orderDirection,
          order_by: getColumnNameByIndex(orderBy),
        });
      }}
      columns={columns as any}
      data={vouchers || []}
      options={{
        draggable,
        initialPage: 1, // @todo include this settings value in a CONSTANTS file
        paging: true,
        pageSize: per_page,
        thirdSortClick: false,
        actionsColumnIndex: columns.length, // @todo this shouldn't be hardcoded, calculate using columns.lenght
        filtering: true,

        rowStyle: (_data: any, index: number, _level: number) => {
          return index % 2 
            ? { backgroundColor: 'rgba(227,27,35,0.1)' }
            : {};
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
            history.push(`/user/${rowData.id}/edit`),
          // disabled: !isAllowed('USR', PERMISSIONS.UPDATE),
        },
        {
          icon: "edit",
          tooltip: "Editar",
          onClick: (event, rowData: any) =>
            history.push(`/voucher/${rowData.id}/edit`),
          // disabled: !isAllowed('USR', PERMISSIONS.UPDATE),
        },
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
