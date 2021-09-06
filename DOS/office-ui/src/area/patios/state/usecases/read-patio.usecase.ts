import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { readPatio } from "../../service/patio.service";
import { patiosReducer } from "../patios.reducer";

const postfix = "/app";
const READ_PATIO = `READ_PATIO${postfix}`;
const READ_PATIO_SUCCESS = `READ_PATIO_SUCCESS${postfix}`;
const READ_PATIO_ERROR = `READ_PATIO_ERROR${postfix}`;

export const readPatioAction: ActionFunctionAny<Action<any>> =
  createAction(READ_PATIO);
export const readPatioSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(READ_PATIO_SUCCESS);
export const readPatioErrorAction: ActionFunctionAny<Action<any>> =
  createAction(READ_PATIO_ERROR);

function* readPatioWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readPatio, id);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(readPatioSuccessAction(result));
  } catch (e: any) {
    const { history } = action.payload;
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );
    yield history.push("/patios/list");
    yield put(readPatioErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
  }
}

function* readPatioWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_PATIO, readPatioWorker);
}

const patiosReducerHandlers = {
  [READ_PATIO]: (state: any) => {
    return {
      ...state,
      loading: true,
      patio: null,
    };
  },
  [READ_PATIO_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      patio: action.payload.patio,
    };
  },
  [READ_PATIO_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(readPatioWatcher);
patiosReducer.addHandlers(patiosReducerHandlers);
