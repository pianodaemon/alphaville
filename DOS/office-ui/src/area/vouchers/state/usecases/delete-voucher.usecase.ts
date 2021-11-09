import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { deleteVoucher } from "../../service/voucher.service";
import { vouchersReducer } from "../vouchers.reducer";
import { loadVouchersAction } from "./load-vouchers.usecase";

const postfix = "/app";
const DELETE_VOUCHER = `DELETE_VOUCHER${postfix}`;
const DELETE_VOUCHER_SUCCESS = `DELETE_VOUCHER_SUCCESS${postfix}`;
const DELETE_VOUCHER_ERROR = `DELETE_VOUCHER_ERROR${postfix}`;

export const deleteVoucherAction: ActionFunctionAny<Action<any>> =
  createAction(DELETE_VOUCHER);
export const deleteVoucherSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(DELETE_VOUCHER_SUCCESS);
export const deleteVoucherErrorAction: ActionFunctionAny<Action<any>> =
  createAction(DELETE_VOUCHER_ERROR);

function* deleteVoucherWorker(action: any): Generator<any, any, any> {
  try {
    const result = yield call(deleteVoucher, action.payload);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(deleteVoucherSuccessAction(result));
    yield put(loadVouchersAction());
    yield put(
      notificationAction({
        message: `¡Vale ${action.payload} ha sido eliminado!`,
      })
    );
  } catch (e: any) {
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );
    yield put(deleteVoucherErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
    yield console.log(e);
  }
}

function* deleteVoucherWatcher(): Generator<any, any, any> {
  yield takeLatest(DELETE_VOUCHER, deleteVoucherWorker);
}

const vouchersReducerHandlers = {
  [DELETE_VOUCHER]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [DELETE_VOUCHER_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [DELETE_VOUCHER_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(deleteVoucherWatcher);
vouchersReducer.addHandlers(vouchersReducerHandlers);
