import { connect } from 'react-redux';
import { EquipmentForm } from './equipment-form.component';
import { createEquipmentAction } from '../state/usecases/create-equipment.usecase';
import { readEquipmentAction } from '../state/usecases/read-equipment.usecase';
import { updateEquipmentAction } from '../state/usecases/update-equipment.usecate';
import {
  equipmentSelector,
} from '../state/equipments.selectors';

const mapDispatchToProps = {
  createEquipmentAction,
  readEquipmentAction,
  updateEquipmentAction,
};

function mapStateToProps(state: any) {
  return {
    equipment: equipmentSelector(state),
  };
}

export const EquipmentsFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EquipmentForm);
