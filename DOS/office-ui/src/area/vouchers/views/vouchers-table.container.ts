import { connect } from 'react-redux';
import { ValesTable } from './vouchers-table.component';
import { loadVouchersAction } from '../state/usecases/load-vouchers.usecase';
import { deleteVoucherAction } from '../state/usecases/delete-voucher.usecase';
// import { permissionSelector } from 'src/area/auth/state/auth.selectors';
import {
  isLoadingSelector,
  vouchersCatalogSelector,
  pagingSelector,
  filtersSelector
} from '../state/vouchers.selectors';

const mapDispatchToProps = {
  loadVouchersAction,
  deleteVoucherAction,
};

function mapStateToProps(state: any) {
  return {
    vouchers: vouchersCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
    // isAllowed: permissionSelector(state),
    filters: filtersSelector(state),
  };
}

export const VouchersTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ValesTable);
