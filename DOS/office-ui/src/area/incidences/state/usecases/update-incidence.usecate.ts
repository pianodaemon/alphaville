import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { updateIncidence } from "../../service/incidence.service";
import { incidencesReducer } from "../incidences.reducer";
import { loadIncidencesAction } from "./load-incidences.usecase";

const postfix = "/app";
const UPDATE_INCIDENCE = `UPDATE_INCIDENCE${postfix}`;
const UPDATE_INCIDENCE_SUCCESS = `UPDATE_INCIDENCE_SUCCESS${postfix}`;
const UPDATE_INCIDENCE_ERROR = `UPDATE_INCIDENCE_ERROR${postfix}`;

export const updateIncidenceAction: ActionFunctionAny<Action<any>> =
  createAction(UPDATE_INCIDENCE);
export const updateIncidenceSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(UPDATE_INCIDENCE_SUCCESS);
export const updateIncidenceErrorAction: ActionFunctionAny<Action<any>> =
  createAction(UPDATE_INCIDENCE_ERROR);

function* updateIncidenceWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history, id } = action.payload;
    const result = yield call(updateIncidence, id, fields);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(updateIncidenceSuccessAction(result));
    if (history) {
      yield history.push("/incidences");
      yield put(loadIncidencesAction());
    }
    yield put(
      notificationAction({
        message: `¡Incidencia ${id} ha sido actualizada!`,
      })
    );
  } catch (e: any) {
    // const { releaseForm } = action.payload;
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );

    // yield releaseForm();
    yield put(updateIncidenceErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
    yield console.log(e);
  }
}

function* updateIncidenceWatcher(): Generator<any, any, any> {
  yield takeLatest(UPDATE_INCIDENCE, updateIncidenceWorker);
}

const incidencesReducerHandlers = {
  [UPDATE_INCIDENCE]: (state: any, action: any) => {
    return {
      ...state,
      incidence: action.payload.fields,
      loading: true,
    };
  },
  [UPDATE_INCIDENCE_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      incidence: null,
    };
  },
  [UPDATE_INCIDENCE_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      error: true,
      incidence: action.payload.fields,
      loading: false,
    };
  },
};

mergeSaga(updateIncidenceWatcher);
incidencesReducer.addHandlers(incidencesReducerHandlers);
