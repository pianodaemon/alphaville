import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { createIncidence } from "../../service/incidence.service";
import { incidencesReducer } from "../incidences.reducer";
import { loadIncidencesAction } from "./load-incidences.usecase";

const postfix = "/app";
const CREATE_INCIDENCE = `CREATE_INCIDENCE${postfix}`;
const CREATE_INCIDENCE_SUCCESS = `CREATE_INCIDENCE_SUCCESS${postfix}`;
const CREATE_INCIDENCE_ERROR = `CREATE_INCIDENCE_ERROR${postfix}`;

export const createIncidenceAction: ActionFunctionAny<Action<any>> =
  createAction(CREATE_INCIDENCE);
export const createIncidenceSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(CREATE_INCIDENCE_SUCCESS);
export const createIncidenceErrorAction: ActionFunctionAny<Action<any>> =
  createAction(CREATE_INCIDENCE_ERROR);

function* createIncidenceWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history } = action.payload;
    const result = yield call(createIncidence, fields);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(createIncidenceSuccessAction(result));
    if (history) {
      yield history.push("/incidences");
      yield put(loadIncidencesAction());
    }
    yield put(
      notificationAction({
        message: `¡Incidencia ${result.returnCode} ha sido creada!`,
        type: "success",
      })
    );
  } catch (e: any) {
    // const { releaseForm } = action.payload;
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );

    // yield releaseForm();
    yield put(createIncidenceErrorAction(action.payload));
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
    yield console.log(e);
  }
}

function* createIncidenceWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_INCIDENCE, createIncidenceWorker);
}

const incidenceReducerHandlers = {
  [CREATE_INCIDENCE]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_INCIDENCE_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      incidence: null,
    };
  },
  [CREATE_INCIDENCE_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      error: true,
      incidence: action.payload.fields,
      loading: false,
    };
  },
};

mergeSaga(createIncidenceWatcher);
incidencesReducer.addHandlers(incidenceReducerHandlers);
