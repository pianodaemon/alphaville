import { connect } from 'react-redux';
import { VoucherForm } from './voucher-form.component';
import { createVoucherAction } from '../state/usecases/create-voucher.usecase';
import { readVoucherAction } from '../state/usecases/read-voucher.usecase';
import { updateVoucherAction } from '../state/usecases/update-voucher.usecate';
import { loadEquipmentsCatalogAction } from 'src/area/equipments/state/usecases/load-equipments-catalog.usecase';
import { loadCarriersCatalogAction } from 'src/area/carriers/state/usecases/load-carriers-catalog.usecase';
import { loadPatiosCatalogAction } from 'src/area/patios/state/usecases/load-patios-catalog.usecase';
import { loadUnitsCatalogAction } from 'src/area/units/state/usecases/load-units-catalog.usecase';
import { loadUsersAsCatalogAction } from 'src/area/users/state/usecases/load-users-as-catalog.usecase';
import { loadStatusesAction } from 'src/area/statuses/state/usecases/load-statuses.usecase';
import { catalogSelector } from 'src/area/equipments/state/equipments.selectors';
import { catalogSelector as carrierCatalogSelector } from 'src/area/carriers/state/carriers.selectors';
import { catalogSelector as patioCatalogSelector } from 'src/area/patios/state/patios.selectors';
import { catalogSelector as unitCatalogSelector } from 'src/area/units/state/units.selectors';
import { userCatalogSelector } from 'src/area/users/state/users.selectors';
import { statusesCatalogSelector } from 'src/area/statuses/state/statuses.selectors';
import {
  // catalogSelector,
  voucherSelector,
} from '../state/vouchers.selectors';

const mapDispatchToProps = {
  loadStatusesAction,
  loadUsersAsCatalogAction,
  loadEquipmentsCatalogAction,
  loadCarriersCatalogAction,
  loadPatiosCatalogAction,
  loadUnitsCatalogAction,
  createVoucherAction,
  readVoucherAction,
  updateVoucherAction,
};

function mapStateToProps(state: any) {
  return {
    voucher: voucherSelector(state),
    equipments: catalogSelector(state),
    carriers: carrierCatalogSelector(state),
    patios: patioCatalogSelector(state),
    units: unitCatalogSelector(state),
    users: userCatalogSelector(state),
    statuses: statusesCatalogSelector(state),
  };
}

export const VourcherFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(VoucherForm);
