import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { readVoucher } from "../../service/voucher.service";
import { vouchersReducer } from "../vouchers.reducer";

const postfix = "/app";
const READ_VOUCHER = `READ_VOUCHER${postfix}`;
const READ_VOUCHER_SUCCESS = `READ_VOUCHER_SUCCESS${postfix}`;
const READ_VOUCHER_ERROR = `READ_VOUCHER_ERROR${postfix}`;

export const readVoucherAction: ActionFunctionAny<Action<any>> =
  createAction(READ_VOUCHER);
export const readVoucherSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(READ_VOUCHER_SUCCESS);
export const readVoucherErrorAction: ActionFunctionAny<Action<any>> =
  createAction(READ_VOUCHER_ERROR);

function* readVoucherWorker(action: any): Generator<any, any, any> {
  try {
    const { id, editMode } = action.payload;
    const result = yield call(readVoucher, id);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(
      readVoucherSuccessAction({ ...result, ...(editMode ? { editMode } : {}) })
    );
  } catch (e: any) {
    const { history } = action.payload;
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );

    yield history.push("/vouchers/list");
    yield put(readVoucherErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
  }
}

function* readVoucherWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_VOUCHER, readVoucherWorker);
}

const vouchersReducerHandlers = {
  [READ_VOUCHER]: (state: any) => {
    return {
      ...state,
      loading: true,
      voucher: null,
      editMode: null,
    };
  },
  [READ_VOUCHER_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      voucher: action.payload.voucher,
      editMode: action.payload.editMode,
    };
  },
  [READ_VOUCHER_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(readVoucherWatcher);
vouchersReducer.addHandlers(vouchersReducerHandlers);
