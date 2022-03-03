import { connect } from "react-redux";
import { loadUsersAsCatalogAction } from "src/area/users/state/usecases/load-users-as-catalog.usecase";
import { loadStatusesAction } from "src/area/statuses/state/usecases/load-statuses.usecase";
import { userIsComunSelector } from "src/area/auth/state/auth.selectors";
import { ValesTable } from "./vouchers-table.component";
import { loadVouchersAction } from "../state/usecases/load-vouchers.usecase";
import { downloadVouchersAction } from "../state/usecases/download-vouchers.usecase";
import { loadUnitsCatalogAction } from "src/area/units/state/usecases/load-units-catalog.usecase";
import { loadCarriersCatalogAction } from "src/area/carriers/state/usecases/load-carriers-catalog.usecase";
// import { deleteVoucherAction } from "../state/usecases/delete-voucher.usecase";
// import { permissionSelector } from 'src/area/auth/state/auth.selectors';
import {
  downloadingSelector,
  isLoadingSelector,
  vouchersCatalogSelector,
  pagingSelector,
  filtersSelector,
  appliedFiltersSelector,
} from "../state/vouchers.selectors";

const mapDispatchToProps = {
  // deleteVoucherAction,
  downloadVouchersAction,
  loadVouchersAction,
  loadUsersAsCatalogAction,
  loadStatusesAction,
  loadUnitsCatalogAction,
  loadCarriersCatalogAction,
};

function mapStateToProps(state: any) {
  return {
    vouchers: vouchersCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
    // isAllowed: permissionSelector(state),
    filters: filtersSelector(state),
    appliedFilters: appliedFiltersSelector(state),
    userIsComun: userIsComunSelector(state),
    downloading: downloadingSelector(state),
  };
}

export const VouchersTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ValesTable);
