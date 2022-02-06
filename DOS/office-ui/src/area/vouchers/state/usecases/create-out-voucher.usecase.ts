import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { createOutVoucher } from "../../service/voucher.service";
import { vouchersReducer } from "../vouchers.reducer";

const postfix = "/app";
const CREATE_OUT_VOUCHER = `CREATE_OUT_VOUCHER${postfix}`;
const CREATE_OUT_VOUCHER_SUCCESS = `CREATE_OUT_VOUCHER_SUCCESS${postfix}`;
const CREATE_OUT_VOUCHER_ERROR = `CREATE_OUT_VOUCHER_ERROR${postfix}`;
const CREATE_OUT_VOUCHER_RESET = `CREATE_OUT_VOUCHER_RESET${postfix}`;

export const createOutVoucherAction: ActionFunctionAny<Action<any>> =
  createAction(CREATE_OUT_VOUCHER);
export const createOutVoucherSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(CREATE_OUT_VOUCHER_SUCCESS);
export const createOutVoucherErrorAction: ActionFunctionAny<Action<any>> =
  createAction(CREATE_OUT_VOUCHER_ERROR);
export const createOutVoucherResetAction: ActionFunctionAny<Action<any>> =
  createAction(CREATE_OUT_VOUCHER_RESET);

function* createOutVoucherWorker(action: any): Generator<any, any, any> {
  try {
    const { data, history } = action.payload;
    const result = yield call(createOutVoucher, data);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    const newVoucherId = result.returnCode;
    yield put(createOutVoucherSuccessAction(result));
    yield history.push(`/voucher/${newVoucherId}/view`);
    yield put(
      notificationAction({
        message: `¡Vale de Salida ID: ${newVoucherId}, ha sido creado!`,
        type: "success",
      })
    );
  } catch (e: any) {
    // const { releaseForm } = action.payload;
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );

    // yield releaseForm();
    yield put(createOutVoucherErrorAction(action.payload));
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
    yield console.log(e);
  }
}

function* createOutVoucherWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_OUT_VOUCHER, createOutVoucherWorker);
}

const voucherReducerHandlers = {
  [CREATE_OUT_VOUCHER_RESET]: (state: any) => {
    return {
      ...state,
      loading: false,
      vouchersCatalog: null,
      vouchersOut: null,
    };
  },
  [CREATE_OUT_VOUCHER]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_OUT_VOUCHER_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [CREATE_OUT_VOUCHER_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(createOutVoucherWatcher);
vouchersReducer.addHandlers(voucherReducerHandlers);
