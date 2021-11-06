import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { readIncidence } from "../../service/incidence.service";
import { incidencesReducer } from "../incidences.reducer";

const postfix = "/app";
const READ_INCIDENCE = `READ_INCIDENCE${postfix}`;
const READ_INCIDENCE_SUCCESS = `READ_INCIDENCE_SUCCESS${postfix}`;
const READ_INCIDENCE_ERROR = `READ_INCIDENCE_ERROR${postfix}`;

export const readIncidenceAction: ActionFunctionAny<Action<any>> =
  createAction(READ_INCIDENCE);
export const readIncidenceSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(READ_INCIDENCE_SUCCESS);
export const readIncidenceErrorAction: ActionFunctionAny<Action<any>> =
  createAction(READ_INCIDENCE_ERROR);

function* readIncidenceWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readIncidence, id);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(readIncidenceSuccessAction(result));
  } catch (e: any) {
    const { history } = action.payload;
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );

    yield history.push("/incidences/list");
    yield put(readIncidenceErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
  }
}

function* readIncidenceWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_INCIDENCE, readIncidenceWorker);
}

const incidencesReducerHandlers = {
  [READ_INCIDENCE]: (state: any) => {
    return {
      ...state,
      loading: true,
      incidence: null,
    };
  },
  [READ_INCIDENCE_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      incidence: action.payload.incidence,
    };
  },
  [READ_INCIDENCE_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(readIncidenceWatcher);
incidencesReducer.addHandlers(incidencesReducerHandlers);
