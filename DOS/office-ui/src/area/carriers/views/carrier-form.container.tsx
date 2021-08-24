import { connect } from 'react-redux';
import { CarrierForm } from './carrier-form.component';
import { createCarrierAction } from '../state/usecases/create-carrier.usecase';
import { readCarrierAction } from '../state/usecases/read-carrier.usecase';
import { updateCarrierAction } from '../state/usecases/update-carrier.usecate';
import {
  carrierSelector,
} from '../state/carriers.selectors';

const mapDispatchToProps = {
  createCarrierAction,
  readCarrierAction,
  updateCarrierAction,
};

function mapStateToProps(state: any) {
  return {
    carrier: carrierSelector(state),
  };
}

export const CarriersFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CarrierForm);
