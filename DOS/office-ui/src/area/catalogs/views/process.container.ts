import { connect } from 'react-redux';
// import { checkAuthAction } from 'src/area/auth/state/usecases/check-auth.usecase';
import { patioTypeCodeSelector } from 'src/area/auth/state/auth.selectors';
import { Process } from './process.component';
// import { permissionSelector } from 'src/area/auth/state/auth.selectors';

const mapDispatchToProps = {
  // checkAuthAction,
};

function mapStateToProps(state: any) {
  return {
    // isLoggedIn: isLoggedInSelector(state),
    // checked: checkedSelector(state),
    // isAllowed: permissionSelector(state),
    userPatioTypeCode: patioTypeCodeSelector(state),
  };
}

export const ProcessContainer = connect(mapStateToProps, mapDispatchToProps)(Process);
