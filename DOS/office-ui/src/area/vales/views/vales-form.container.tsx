import { connect } from 'react-redux';
import { ValesForm } from './vales-form.component';
import { createUserAction } from '../../users/state/usecases/create-user.usecase';
import { readUserAction } from '../../users/state/usecases/read-user.usecase';
import { updateUserAction } from '../../users/state/usecases/update-user.usecate';
import { loadUsersCatalogAction } from '../../users/state/usecases/load-users-catalog.usecase';
import {
  catalogSelector,
  userSelector,
} from '../../users/state/users.selectors';

const mapDispatchToProps = {
  loadUsersCatalogAction,
  createUserAction,
  readUserAction,
  updateUserAction,
};

function mapStateToProps(state: any) {
  return {
    user: userSelector(state),
    catalog: catalogSelector(state),
  };
}

export const ValesFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ValesForm);
