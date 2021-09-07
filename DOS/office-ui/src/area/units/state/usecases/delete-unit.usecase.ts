import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { deleteUnit } from "../../service/unit.service";
import { unitsReducer } from "../units.reducer";
import { loadUnitsAction } from "./load-units.usecase";

const postfix = "/app";
const DELETE_UNIT = `DELETE_UNIT${postfix}`;
const DELETE_UNIT_SUCCESS = `DELETE_UNIT_SUCCESS${postfix}`;
const DELETE_UNIT_ERROR = `DELETE_UNIT_ERROR${postfix}`;

export const deleteUnitAction: ActionFunctionAny<Action<any>> =
  createAction(DELETE_UNIT);
export const deleteUnitSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(DELETE_UNIT_SUCCESS);
export const deleteUnitErrorAction: ActionFunctionAny<Action<any>> =
  createAction(DELETE_UNIT_ERROR);

function* deleteUnitWorker(action: any): Generator<any, any, any> {
  try {
    const result = yield call(deleteUnit, action.payload);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(deleteUnitSuccessAction(result));
    yield put(loadUnitsAction());
    yield put(
      notificationAction({
        message: `¡Unidad ${action.payload} ha sido eliminada!`,
      })
    );
  } catch (e: any) {
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );

    yield put(deleteUnitErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
    yield console.log(e);
  }
}

function* deleteUnitWatcher(): Generator<any, any, any> {
  yield takeLatest(DELETE_UNIT, deleteUnitWorker);
}

const unitsReducerHandlers = {
  [DELETE_UNIT]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [DELETE_UNIT_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [DELETE_UNIT_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(deleteUnitWatcher);
unitsReducer.addHandlers(unitsReducerHandlers);
