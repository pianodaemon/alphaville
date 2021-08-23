import { connect } from 'react-redux';
import { PatiosTable } from './patios-table.component';
import { loadPatiosAction } from '../state/usecases/load-patios.usecase';
import { deletePatioAction } from '../state/usecases/delete-patio.usecase';
// import { permissionSelector } from 'src/area/auth/state/auth.selectors';
import {
  patiosCatalogSelector,
  isLoadingSelector,
  pagingSelector,
  filtersSelector
} from '../state/patios.selectors';

const mapDispatchToProps = {
  loadPatiosAction,
  deletePatioAction,
};

function mapStateToProps(state: any) {
  return {
    patios: patiosCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
    // isAllowed: permissionSelector(state),
    filters: filtersSelector(state),
  };
}

export const PatiosTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatiosTable);
