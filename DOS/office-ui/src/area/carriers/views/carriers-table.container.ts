import { connect } from 'react-redux';
import { CarriersTable } from './carriers-table.component';
import { loadCarriersAction } from '../state/usecases/load-carriers.usecase';
import { deleteCarrierAction } from '../state/usecases/delete-carrier.usecase';
// import { permissionSelector } from 'src/area/auth/state/auth.selectors';
import {
  carriersCatalogSelector,
  isLoadingSelector,
  pagingSelector,
  filtersSelector
} from '../state/carriers.selectors';

const mapDispatchToProps = {
  loadCarriersAction,
  deleteCarrierAction,
};

function mapStateToProps(state: any) {
  return {
    carriers: carriersCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
    // isAllowed: permissionSelector(state),
    filters: filtersSelector(state),
  };
}

export const CarriersTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CarriersTable);
