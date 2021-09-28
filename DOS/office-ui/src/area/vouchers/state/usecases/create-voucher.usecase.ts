import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { createVoucher } from "../../service/voucher.service";
import { vouchersReducer } from "../vouchers.reducer";
import { loadVouchersAction } from "./load-vouchers.usecase";

const postfix = "/app";
const CREATE_VOUCHER = `CREATE_VOUCHER${postfix}`;
const CREATE_VOUCHER_SUCCESS = `CREATE_VOUCHER_SUCCESS${postfix}`;
const CREATE_VOUCHER_ERROR = `CREATE_VOUCHER_ERROR${postfix}`;

export const createVoucherAction: ActionFunctionAny<Action<any>> =
  createAction(CREATE_VOUCHER);
export const createVoucherSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(CREATE_VOUCHER_SUCCESS);
export const createVoucherErrorAction: ActionFunctionAny<Action<any>> =
  createAction(CREATE_VOUCHER_ERROR);

function* createVoucherWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history } = action.payload;
    const result = yield call(createVoucher, fields);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(createVoucherSuccessAction(result));
    yield history.push("/vouchers");
    yield put(loadVouchersAction());
    yield put(
      notificationAction({
        message: `¡Voucher ${result.returnCode} ha sido creado!`,
        type: "success",
      })
    );
  } catch (e: any) {
    // const { releaseForm } = action.payload;
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );

    // yield releaseForm();
    yield put(createVoucherErrorAction(action.payload));
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
    yield console.log(e);
  }
}

function* createVoucherWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_VOUCHER, createVoucherWorker);
}

const voucherReducerHandlers = {
  [CREATE_VOUCHER]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_VOUCHER_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      voucher: null,
    };
  },
  [CREATE_VOUCHER_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      error: true,
      voucher: action.payload.fields,
      loading: false,
    };
  },
};

mergeSaga(createVoucherWatcher);
vouchersReducer.addHandlers(voucherReducerHandlers);
