import { connect } from 'react-redux';
import { PatioForm } from './patio-form.component';
import { createPatioAction } from '../state/usecases/create-patio.usecase';
import { readPatioAction } from '../state/usecases/read-patio.usecase';
import { updatePatioAction } from '../state/usecases/update-patio.usecate';
import {
  patioSelector,
} from '../state/patios.selectors';

const mapDispatchToProps = {
  createPatioAction,
  readPatioAction,
  updatePatioAction,
};

function mapStateToProps(state: any) {
  return {
    patio: patioSelector(state),
  };
}

export const PatiosFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(PatioForm);
