import { connect } from 'react-redux';
import { UsersTable } from './users-table.component';
import { loadUsersAction } from '../state/usecases/load-users.usecase';
import { deleteUserAction } from '../state/usecases/delete-user.usecase';
// import { permissionSelector } from 'src/area/auth/state/auth.selectors';
import {
  isLoadingSelector,
  usersCatalogSelector,
  pagingSelector,
  filtersSelector
} from '../state/users.selectors';

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

export const UsersTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersTable);
