import { connect } from "react-redux";
import { VoucherPdf } from "./voucher-pdf.component";
import { readVoucherAction } from "../state/usecases/read-voucher.usecase";
import { loadEquipmentsCatalogAction } from "src/area/equipments/state/usecases/load-equipments-catalog.usecase";
import { loadCarriersCatalogAction } from "src/area/carriers/state/usecases/load-carriers-catalog.usecase";
import { loadPatiosCatalogAction } from "src/area/patios/state/usecases/load-patios-catalog.usecase";
import { loadUnitsCatalogAction } from "src/area/units/state/usecases/load-units-catalog.usecase";
import { loadUsersAsCatalogAction } from "src/area/users/state/usecases/load-users-as-catalog.usecase";
import { voucherPdfSelector } from "../state/vouchers.selectors";

const mapDispatchToProps = {
  loadUsersAsCatalogAction,
  loadEquipmentsCatalogAction,
  loadCarriersCatalogAction,
  loadPatiosCatalogAction,
  loadUnitsCatalogAction,
  readVoucherAction,
};

function mapStateToProps(state: any) {
  return {
    voucher: voucherPdfSelector(state),
  };
}

export const VourcherPdfContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(VoucherPdf);
