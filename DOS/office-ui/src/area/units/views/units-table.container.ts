import { connect } from 'react-redux';
import { UnitsTable } from './units-table.component';
import { loadUnitsAction } from '../state/usecases/load-units.usecase';
import { deleteUnitAction } from '../state/usecases/delete-unit.usecase';
// import { permissionSelector } from 'src/area/auth/state/auth.selectors';
import {
  unitsCatalogSelector,
  isLoadingSelector,
  pagingSelector,
  filtersSelector
} from '../state/units.selectors';

const mapDispatchToProps = {
  loadUnitsAction,
  deleteUnitAction,
};

function mapStateToProps(state: any) {
  return {
    units: unitsCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
    // isAllowed: permissionSelector(state),
    filters: filtersSelector(state),
  };
}

export const UnitsTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UnitsTable);
