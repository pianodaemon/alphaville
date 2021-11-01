import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { updatePatioVoucher } from "../../service/patio-voucher.service";
import { patioVouchersReducer } from "../patio-vouchers.reducer";
import { loadPatioVouchersAction } from "./load-patio-vouchers.usecase";

const postfix = "/app";
const UPDATE_PATIO_VOUCHER = `UPDATE_PATIO_VOUCHER${postfix}`;
const UPDATE_PATIO_VOUCHER_SUCCESS = `UPDATE_PATIO_VOUCHER_SUCCESS${postfix}`;
const UPDATE_PATIO_VOUCHER_ERROR = `UPDATE_PATIO_VOUCHER_ERROR${postfix}`;

export const updatePatioVoucherAction: ActionFunctionAny<Action<any>> =
  createAction(UPDATE_PATIO_VOUCHER);
export const updatePatioVoucherSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(UPDATE_PATIO_VOUCHER_SUCCESS);
export const updatePatioVoucherErrorAction: ActionFunctionAny<Action<any>> =
  createAction(UPDATE_PATIO_VOUCHER_ERROR);

function* updatePatioVoucherWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history, id } = action.payload;
    const result = yield call(updatePatioVoucher, id, fields);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(updatePatioVoucherSuccessAction(result));
    yield history.push("/patio-vouchers");
    yield put(loadPatioVouchersAction());
    yield put(
      notificationAction({
        message: `¡Vale para equipo dejado en patio ${id} ha sido actualizado!`,
      })
    );
  } catch (e: any) {
    // const { releaseForm } = action.payload;
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );

    // yield releaseForm();
    yield put(updatePatioVoucherErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
    yield console.log(e);
  }
}

function* updatePatioVoucherWatcher(): Generator<any, any, any> {
  yield takeLatest(UPDATE_PATIO_VOUCHER, updatePatioVoucherWorker);
}

const patioVouchersReducerHandlers = {
  [UPDATE_PATIO_VOUCHER]: (state: any, action: any) => {
    return {
      ...state,
      patioVoucher: action.payload.fields,
      loading: true,
    };
  },
  [UPDATE_PATIO_VOUCHER_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      patioVoucher: null,
    };
  },
  [UPDATE_PATIO_VOUCHER_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      error: true,
      patioVoucher: action.payload.fields,
      loading: false,
    };
  },
};

mergeSaga(updatePatioVoucherWatcher);
patioVouchersReducer.addHandlers(patioVouchersReducerHandlers);
