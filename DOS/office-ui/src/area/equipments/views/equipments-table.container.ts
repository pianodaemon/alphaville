import { connect } from 'react-redux';
import { EquipmentsTable } from './equipments-table.component';
import { loadEquipmentsAction } from '../state/usecases/load-equipments.usecase';
import { deleteEquipmentAction } from '../state/usecases/delete-equipment.usecase';
// import { permissionSelector } from 'src/area/auth/state/auth.selectors';
import {
  equipmentsCatalogSelector,
  isLoadingSelector,
  pagingSelector,
  filtersSelector
} from '../state/equipments.selectors';

const mapDispatchToProps = {
  loadEquipmentsAction,
  deleteEquipmentAction,
};

function mapStateToProps(state: any) {
  return {
    equipments: equipmentsCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
    // isAllowed: permissionSelector(state),
    filters: filtersSelector(state),
  };
}

export const EquipmentsTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EquipmentsTable);
