import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { deleteIncidence } from "../../service/incidence.service";
import { incidencesReducer } from "../incidences.reducer";
import { loadIncidencesAction } from "./load-incidences.usecase";

const postfix = "/app";
const DELETE_INCIDENCE = `DELETE_INCIDENCE${postfix}`;
const DELETE_INCIDENCE_SUCCESS = `DELETE_INCIDENCE_SUCCESS${postfix}`;
const DELETE_INCIDENCE_ERROR = `DELETE_INCIDENCE_ERROR${postfix}`;

export const deleteIncidenceAction: ActionFunctionAny<Action<any>> =
  createAction(DELETE_INCIDENCE);
export const deleteIncidenceSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(DELETE_INCIDENCE_SUCCESS);
export const deleteIncidenceErrorAction: ActionFunctionAny<Action<any>> =
  createAction(DELETE_INCIDENCE_ERROR);

function* deleteIncidenceWorker(action: any): Generator<any, any, any> {
  try {
    const result = yield call(deleteIncidence, action.payload);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(deleteIncidenceSuccessAction(result));
    yield put(loadIncidencesAction());
    yield put(
      notificationAction({
        message: `¡Incidencia ${action.payload} ha sido eliminada!`,
      })
    );
  } catch (e: any) {
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );
    yield put(deleteIncidenceErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
    yield console.log(e);
  }
}

function* deleteIncidenceWatcher(): Generator<any, any, any> {
  yield takeLatest(DELETE_INCIDENCE, deleteIncidenceWorker);
}

const incidencesReducerHandlers = {
  [DELETE_INCIDENCE]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [DELETE_INCIDENCE_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [DELETE_INCIDENCE_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(deleteIncidenceWatcher);
incidencesReducer.addHandlers(incidencesReducerHandlers);
