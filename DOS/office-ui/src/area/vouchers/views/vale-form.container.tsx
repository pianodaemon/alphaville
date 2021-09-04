import { connect } from 'react-redux';
import { ValesForm } from './vale-form.component';
import { createVoucherAction } from '../state/usecases/create-voucher.usecase';
import { readVoucherAction } from '../state/usecases/read-voucher.usecase';
import { updateVoucherAction } from '../state/usecases/update-voucher.usecate';
// import { loadUsersCatalogAction } from '../state/usecases/load-voucher-catalog.usecase';
import {
  // catalogSelector,
  voucherSelector,
} from '../state/vouchers.selectors';

const mapDispatchToProps = {
  // loadUsersCatalogAction,
  createVoucherAction,
  readVoucherAction,
  updateVoucherAction,
};

function mapStateToProps(state: any) {
  return {
    voucher: voucherSelector(state),
    // catalog: catalogSelector(state),
  };
}

export const ValesFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ValesForm);
