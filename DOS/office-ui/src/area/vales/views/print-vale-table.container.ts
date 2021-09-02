import { connect } from 'react-redux';
import { PrintValeTable } from './print-vale-table.component';
import { loadUsersAction } from '../../users/state/usecases/load-users.usecase';
import { deleteUserAction } from '../../users/state/usecases/delete-user.usecase';
// import { permissionSelector } from 'src/area/auth/state/auth.selectors';
import {
  isLoadingSelector,
  usersCatalogSelector,
  pagingSelector,
  filtersSelector
} from '../../users/state/users.selectors';

const mapDispatchToProps = {
  loadUsersAction,
  deleteUserAction,
};

function mapStateToProps(state: any) {
  return {
    users: usersCatalogSelector(state),
    loading: isLoadingSelector(state),
    paging: pagingSelector(state),
    // isAllowed: permissionSelector(state),
    filters: filtersSelector(state),
  };
}

export const PrintValeTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PrintValeTable);
