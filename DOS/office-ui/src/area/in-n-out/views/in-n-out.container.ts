import { connect } from "react-redux";
import {
  searchSelector,
  searchLoadingSelector,
} from "src/area/vouchers/state/vouchers.selectors";
import {
  searchVoucherAction,
  searchVoucherResetAction,
} from "src/area/vouchers/state/usecases/search-voucher.usecase";
import { patioSelector } from "src/area/auth/state/auth.selectors";
import { InNout } from "./in-n-out.component";

const mapDispatchToProps = {
  searchVoucherAction,
  searchVoucherResetAction,
};

function mapStateToProps(state: any) {
  return {
    loading: searchLoadingSelector(state),
    patio: patioSelector(state),
    voucher: searchSelector(state),
  };
}

export const InNoutContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(InNout);
