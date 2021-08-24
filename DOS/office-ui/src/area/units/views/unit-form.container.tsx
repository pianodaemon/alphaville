import { connect } from 'react-redux';
import { UnitForm } from './unit-form.component';
import { createUnitAction } from '../state/usecases/create-unit.usecase';
import { readUnitAction } from '../state/usecases/read-unit.usecase';
import { updateUnitAction } from '../state/usecases/update-unit.usecate';
import {
  unitSelector,
} from '../state/units.selectors';

const mapDispatchToProps = {
  createUnitAction,
  readUnitAction,
  updateUnitAction,
};

function mapStateToProps(state: any) {
  return {
    unit: unitSelector(state),
  };
}

export const UnitsFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UnitForm);
