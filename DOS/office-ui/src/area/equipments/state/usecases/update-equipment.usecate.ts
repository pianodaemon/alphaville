import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { updateEquipment } from "../../service/equipment.service";
import { equipmentsReducer } from "../equipments.reducer";
import { loadEquipmentsAction } from "./load-equipments.usecase";

const postfix = "/app";
const UPDATE_EQUIPMENT = `UPDATE_EQUIPMENT${postfix}`;
const UPDATE_EQUIPMENT_SUCCESS = `UPDATE_EQUIPMENT_SUCCESS${postfix}`;
const UPDATE_EQUIPMENT_ERROR = `UPDATE_EQUIPMENT_ERROR${postfix}`;

export const updateEquipmentAction: ActionFunctionAny<Action<any>> =
  createAction(UPDATE_EQUIPMENT);
export const updateEquipmentSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(UPDATE_EQUIPMENT_SUCCESS);
export const updateEquipmentErrorAction: ActionFunctionAny<Action<any>> =
  createAction(UPDATE_EQUIPMENT_ERROR);

function* updateEquipmentWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history, id } = action.payload;
    const result = yield call(updateEquipment, id, fields);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(updateEquipmentSuccessAction(result));
    yield history.push("/equipments");
    yield put(loadEquipmentsAction());
    yield put(
      notificationAction({
        message: `¡Equipo ${id} ha sido actualizado!`,
      })
    );
  } catch (e: any) {
    // const { releaseForm } = action.payload;
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );

    // yield releaseForm();
    yield put(updateEquipmentErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
    yield console.log(e);
  }
}

function* updateEquipmentWatcher(): Generator<any, any, any> {
  yield takeLatest(UPDATE_EQUIPMENT, updateEquipmentWorker);
}

const equipmentsReducerHandlers = {
  [UPDATE_EQUIPMENT]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [UPDATE_EQUIPMENT_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      equipment: null,
    };
  },
  [UPDATE_EQUIPMENT_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(updateEquipmentWatcher);
equipmentsReducer.addHandlers(equipmentsReducerHandlers);
