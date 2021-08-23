import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { deleteEquipment } from '../../service/equipment.service';
import { equipmentsReducer } from '../equipments.reducer';
import { loadEquipmentsAction } from './load-equipments.usecase';

const postfix = '/app';
const DELETE_EQUIPMENT = `DELETE_EQUIPMENT${postfix}`;
const DELETE_EQUIPMENT_SUCCESS = `DELETE_EQUIPMENT_SUCCESS${postfix}`;
const DELETE_EQUIPMENT_ERROR = `DELETE_EQUIPMENT_ERROR${postfix}`;

export const deleteEquipmentAction: ActionFunctionAny<Action<any>> = createAction(
  DELETE_EQUIPMENT
);
export const deleteEquipmentSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(DELETE_EQUIPMENT_SUCCESS);
export const deleteEquipmentErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(DELETE_EQUIPMENT_ERROR);

function* deleteEquipmentWorker(action: any): Generator<any, any, any> {
  try {
    const result = yield call(deleteEquipment, action.payload);
    yield put(deleteEquipmentSuccessAction(result));
    yield put(loadEquipmentsAction());
    yield put(
      notificationAction({
        message: `¡Equipment ${action.payload} ha sido eliminado!`,
      }),
    );
  } catch (e) {
    const message =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    yield put(deleteEquipmentErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      }),
    );
    yield console.log(e);
  }
}

function* deleteEquipmentWatcher(): Generator<any, any, any> {
  yield takeLatest(DELETE_EQUIPMENT, deleteEquipmentWorker);
}

const equipmentsReducerHandlers = {
  [DELETE_EQUIPMENT]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [DELETE_EQUIPMENT_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [DELETE_EQUIPMENT_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(deleteEquipmentWatcher);
equipmentsReducer.addHandlers(equipmentsReducerHandlers);
