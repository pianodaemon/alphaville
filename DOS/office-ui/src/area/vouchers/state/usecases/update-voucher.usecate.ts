import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { updateVoucher } from "../../service/voucher.service";
import { vouchersReducer } from "../vouchers.reducer";
import { loadVouchersAction } from "./load-vouchers.usecase";

const postfix = "/app";
const UPDATE_VOUCHER = `UPDATE_VOUCHER${postfix}`;
const UPDATE_VOUCHER_SUCCESS = `UPDATE_VOUCHER_SUCCESS${postfix}`;
const UPDATE_VOUCHER_ERROR = `UPDATE_VOUCHER_ERROR${postfix}`;

export const updateVoucherAction: ActionFunctionAny<Action<any>> =
  createAction(UPDATE_VOUCHER);
export const updateVoucherSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(UPDATE_VOUCHER_SUCCESS);
export const updateVoucherErrorAction: ActionFunctionAny<Action<any>> =
  createAction(UPDATE_VOUCHER_ERROR);

function* updateVoucherWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history, id } = action.payload;
    const result = yield call(updateVoucher, id, fields);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(updateVoucherSuccessAction(result));
    yield history.push("/vouchers");
    yield put(loadVouchersAction());
    yield put(
      notificationAction({
        message: `¡Voucher ${id} ha sido actualizado!`,
      })
    );
  } catch (e: any) {
    // const { releaseForm } = action.payload;
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );

    // yield releaseForm();
    yield put(updateVoucherErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
    yield console.log(e);
  }
}

function* updateVoucherWatcher(): Generator<any, any, any> {
  yield takeLatest(UPDATE_VOUCHER, updateVoucherWorker);
}

const vouchersReducerHandlers = {
  [UPDATE_VOUCHER]: (state: any, action: any) => {
    return {
      ...state,
      voucher: action.payload.fields,
      loading: true,
    };
  },
  [UPDATE_VOUCHER_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      voucher: null,
    };
  },
  [UPDATE_VOUCHER_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(updateVoucherWatcher);
vouchersReducer.addHandlers(vouchersReducerHandlers);
