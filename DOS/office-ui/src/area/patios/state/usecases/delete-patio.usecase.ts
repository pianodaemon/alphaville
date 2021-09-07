import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { deletePatio } from "../../service/patio.service";
import { patiosReducer } from "../patios.reducer";
import { loadPatiosAction } from "./load-patios.usecase";

const postfix = "/app";
const DELETE_PATIO = `DELETE_PATIO${postfix}`;
const DELETE_PATIO_SUCCESS = `DELETE_PATIO_SUCCESS${postfix}`;
const DELETE_PATIO_ERROR = `DELETE_PATIO_ERROR${postfix}`;

export const deletePatioAction: ActionFunctionAny<Action<any>> =
  createAction(DELETE_PATIO);
export const deletePatioSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(DELETE_PATIO_SUCCESS);
export const deletePatioErrorAction: ActionFunctionAny<Action<any>> =
  createAction(DELETE_PATIO_ERROR);

function* deletePatioWorker(action: any): Generator<any, any, any> {
  try {
    const result = yield call(deletePatio, action.payload);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(deletePatioSuccessAction(result));
    yield put(loadPatiosAction());
    yield put(
      notificationAction({
        message: `¡Patio ${action.payload} ha sido eliminado!`,
      })
    );
  } catch (e: any) {
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );

    yield put(deletePatioErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
    yield console.log(e);
  }
}

function* deletePatioWatcher(): Generator<any, any, any> {
  yield takeLatest(DELETE_PATIO, deletePatioWorker);
}

const patiosReducerHandlers = {
  [DELETE_PATIO]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [DELETE_PATIO_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [DELETE_PATIO_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(deletePatioWatcher);
patiosReducer.addHandlers(patiosReducerHandlers);
