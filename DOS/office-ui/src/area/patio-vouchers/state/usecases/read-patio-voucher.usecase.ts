import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { readPatioVoucher } from "../../service/patio-voucher.service";
import { patioVouchersReducer } from "../patio-vouchers.reducer";

const postfix = "/app";
const READ_PATIO_VOUCHER = `READ_PATIO_VOUCHER${postfix}`;
const READ_PATIO_VOUCHER_SUCCESS = `READ_PATIO_VOUCHER_SUCCESS${postfix}`;
const READ_PATIO_VOUCHER_ERROR = `READ_PATIO_VOUCHER_ERROR${postfix}`;

export const readPatioVoucherAction: ActionFunctionAny<Action<any>> =
  createAction(READ_PATIO_VOUCHER);
export const readPatioVoucherSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(READ_PATIO_VOUCHER_SUCCESS);
export const readPatioVoucherErrorAction: ActionFunctionAny<Action<any>> =
  createAction(READ_PATIO_VOUCHER_ERROR);

function* readPatioVoucherWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readPatioVoucher, id);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(readPatioVoucherSuccessAction(result));
  } catch (e: any) {
    const { history } = action.payload;
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );

    yield history.push("/patio-vouchers/list");
    yield put(readPatioVoucherErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
  }
}

function* readPatioVoucherWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_PATIO_VOUCHER, readPatioVoucherWorker);
}

const patioVouchersReducerHandlers = {
  [READ_PATIO_VOUCHER]: (state: any) => {
    return {
      ...state,
      loading: true,
      patioVoucher: null,
    };
  },
  [READ_PATIO_VOUCHER_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      patioVoucher: action.payload.patioVoucher,
    };
  },
  [READ_PATIO_VOUCHER_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(readPatioVoucherWatcher);
patioVouchersReducer.addHandlers(patioVouchersReducerHandlers);
