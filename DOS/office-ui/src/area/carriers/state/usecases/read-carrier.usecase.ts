import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { readCarrier } from "../../service/carrier.service";
import { carriersReducer } from "../carriers.reducer";

const postfix = "/app";
const READ_CARRIER = `READ_CARRIER${postfix}`;
const READ_CARRIER_SUCCESS = `READ_CARRIER_SUCCESS${postfix}`;
const READ_CARRIER_ERROR = `READ_CARRIER_ERROR${postfix}`;

export const readCarrierAction: ActionFunctionAny<Action<any>> =
  createAction(READ_CARRIER);
export const readCarrierSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(READ_CARRIER_SUCCESS);
export const readCarrierErrorAction: ActionFunctionAny<Action<any>> =
  createAction(READ_CARRIER_ERROR);

function* readCarrierWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readCarrier, id);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(readCarrierSuccessAction(result));
  } catch (e: any) {
    const { history } = action.payload;
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );

    yield history.push("/carriers/list");
    yield put(readCarrierErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
  }
}

function* readCarrierWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_CARRIER, readCarrierWorker);
}

const carriersReducerHandlers = {
  [READ_CARRIER]: (state: any) => {
    return {
      ...state,
      loading: true,
      carrier: null,
    };
  },
  [READ_CARRIER_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      carrier: action.payload.carrier,
    };
  },
  [READ_CARRIER_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(readCarrierWatcher);
carriersReducer.addHandlers(carriersReducerHandlers);
