import { connect } from "react-redux";
import { Out } from "./out.componet";
import { outSelector } from "src/area/carriers/state/carriers.selectors";
import { vouchersCatalogIdsSelector, vouchersOutSelector } from "src/area/vouchers/state/vouchers.selectors";
import { loadCarriersCatalogAction } from "src/area/carriers/state/usecases/load-carriers-catalog.usecase";
import { loadVouchersCatalogAction } from "src/area/vouchers/state/usecases/load-vouchers-catalog.usecase";
import { readVoucherOutAction } from "src/area/vouchers/state/usecases/read-voucher-out.usecase";
import { createOutVoucherAction, createOutVoucherResetAction } from "src/area/vouchers/state/usecases/create-out-voucher.usecase";
import {
  usernameSelector,
} from "src/area/auth/state/auth.selectors";

const mapDispatchToProps = {
  loadCarriersCatalogAction,
  loadVouchersCatalogAction,
  createOutVoucherResetAction,
  createOutVoucherAction,
  readVoucherOutAction,
};

function mapStateToProps(state: any) {
  return {
    carriers: outSelector(state),
    vouchers: vouchersCatalogIdsSelector(state),
    vouchersOut: vouchersOutSelector(state),
    username: usernameSelector(state),
  };
}

export const OutContainer = connect(mapStateToProps, mapDispatchToProps)(Out);
