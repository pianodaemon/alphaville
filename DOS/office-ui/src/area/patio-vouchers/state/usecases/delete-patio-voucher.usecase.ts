import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { deletePatioVoucher } from "../../service/patio-voucher.service";
import { patioVouchersReducer } from "../patio-vouchers.reducer";
import { loadPatioVouchersAction } from "./load-patio-vouchers.usecase";

const postfix = "/app";
const DELETE_PATIO_VOUCHER = `DELETE_PATIO_VOUCHER${postfix}`;
const DELETE_PATIO_VOUCHER_SUCCESS = `DELETE_PATIO_VOUCHER_SUCCESS${postfix}`;
const DELETE_PATIO_VOUCHER_ERROR = `DELETE_PATIO_VOUCHER_ERROR${postfix}`;

export const deletePatioVoucherAction: ActionFunctionAny<Action<any>> =
  createAction(DELETE_PATIO_VOUCHER);
export const deletePatioVoucherSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(DELETE_PATIO_VOUCHER_SUCCESS);
export const deletePatioVoucherErrorAction: ActionFunctionAny<Action<any>> =
  createAction(DELETE_PATIO_VOUCHER_ERROR);

function* deletePatioVoucherWorker(action: any): Generator<any, any, any> {
  try {
    const result = yield call(deletePatioVoucher, action.payload);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(deletePatioVoucherSuccessAction(result));
    yield put(loadPatioVouchersAction());
    yield put(
      notificationAction({
        message: `¡Vale para equipo dejado en patio ${action.payload} ha sido eliminado!`,
      })
    );
  } catch (e: any) {
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );
    yield put(deletePatioVoucherErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
    yield console.log(e);
  }
}

function* deletePatioVoucherWatcher(): Generator<any, any, any> {
  yield takeLatest(DELETE_PATIO_VOUCHER, deletePatioVoucherWorker);
}

const patioVouchersReducerHandlers = {
  [DELETE_PATIO_VOUCHER]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [DELETE_PATIO_VOUCHER_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [DELETE_PATIO_VOUCHER_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(deletePatioVoucherWatcher);
patioVouchersReducer.addHandlers(patioVouchersReducerHandlers);
