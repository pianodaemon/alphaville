import { connect } from "react-redux";
import { Out } from "./out.componet";
import { outSelector } from "src/area/carriers/state/carriers.selectors";
import { vouchersCatalogIdsSelector, vouchersOutSelector } from "src/area/vouchers/state/vouchers.selectors";
import { loadCarriersCatalogAction } from "src/area/carriers/state/usecases/load-carriers-catalog.usecase";
import { loadUnitsCatalogAction } from "src/area/units/state/usecases/load-units-catalog.usecase";
import { loadUsersAsCatalogAction } from "src/area/users/state/usecases/load-users-as-catalog.usecase";
import { loadVouchersCatalogAction } from "src/area/vouchers/state/usecases/load-vouchers-catalog.usecase";
import { readVoucherOutAction } from "src/area/vouchers/state/usecases/read-voucher-out.usecase";
import { createOutVoucherAction, createOutVoucherResetAction } from "src/area/vouchers/state/usecases/create-out-voucher.usecase";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import {
  usernameSelector,
} from "src/area/auth/state/auth.selectors";
import { catalogSelector as unitCatalogSelector } from "src/area/units/state/units.selectors";
import { userCatalogSelector } from "src/area/users/state/users.selectors";


const mapDispatchToProps = {
  loadCarriersCatalogAction,
  loadUnitsCatalogAction,
  loadUsersAsCatalogAction,
  loadVouchersCatalogAction,
  createOutVoucherResetAction,
  createOutVoucherAction,
  readVoucherOutAction,
  notificationAction,
};

function mapStateToProps(state: any) {
  return {
    carriers: outSelector(state),
    vouchers: vouchersCatalogIdsSelector(state),
    vouchersOut: vouchersOutSelector(state),
    units: unitCatalogSelector(state),
    username: usernameSelector(state),
    users: userCatalogSelector(state),
  };
}

export const OutContainer = connect(mapStateToProps, mapDispatchToProps)(Out);
