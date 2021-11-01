import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { createPatioVoucher } from "../../service/patio-voucher.service";
import { patioVouchersReducer } from "../patio-vouchers.reducer";
import { loadPatioVouchersAction } from "./load-patio-vouchers.usecase";

const postfix = "/app";
const CREATE_PATIO_VOUCHER = `CREATE_PATIO_VOUCHER${postfix}`;
const CREATE_PATIO_VOUCHER_SUCCESS = `CREATE_PATIO_VOUCHER_SUCCESS${postfix}`;
const CREATE_PATIO_VOUCHER_ERROR = `CREATE_PATIO_VOUCHER_ERROR${postfix}`;

export const createPatioVoucherAction: ActionFunctionAny<Action<any>> =
  createAction(CREATE_PATIO_VOUCHER);
export const createPatioVoucherSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(CREATE_PATIO_VOUCHER_SUCCESS);
export const createPatioVoucherErrorAction: ActionFunctionAny<Action<any>> =
  createAction(CREATE_PATIO_VOUCHER_ERROR);

function* createPatioVoucherWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history } = action.payload;
    const result = yield call(createPatioVoucher, fields);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(createPatioVoucherSuccessAction(result));
    if (history) {
      yield history.push("/patio-vouchers");
    }
    yield put(loadPatioVouchersAction());
    yield put(
      notificationAction({
        message: `¡Vale para equipo dejado en patio ${result.returnCode} ha sido creado!`,
        type: "success",
      })
    );
  } catch (e: any) {
    // const { releaseForm } = action.payload;
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );

    // yield releaseForm();
    yield put(createPatioVoucherErrorAction(action.payload));
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
    yield console.log(e);
  }
}

function* createPatioVoucherWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_PATIO_VOUCHER, createPatioVoucherWorker);
}

const patioVoucherReducerHandlers = {
  [CREATE_PATIO_VOUCHER]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_PATIO_VOUCHER_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      patioVoucher: null,
    };
  },
  [CREATE_PATIO_VOUCHER_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      error: true,
      patioVoucher: action.payload.fields,
      loading: false,
    };
  },
};

mergeSaga(createPatioVoucherWatcher);
patioVouchersReducer.addHandlers(patioVoucherReducerHandlers);
