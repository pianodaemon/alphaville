import { connect } from 'react-redux';
import { searchSelector, searchLoadingSelector } from 'src/area/vouchers/state/vouchers.selectors';
import { InNout } from './in-n-out.component';
import { searchVoucherAction, searchVoucherResetAction } from 'src/area/vouchers/state/usecases/search-voucher.usecase';

const mapDispatchToProps = {
  searchVoucherAction,
  searchVoucherResetAction,
};

function mapStateToProps(state: any) {
  return {
    voucher: searchSelector(state),
    loading: searchLoadingSelector(state),
  };
}

export const InNoutContainer = connect(mapStateToProps, mapDispatchToProps)(InNout);
