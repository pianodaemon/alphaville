import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, debounce, put } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { readPatioVoucher } from "../../service/patio-voucher.service";
import { patioVouchersReducer } from "../patio-vouchers.reducer";

const postfix = "/app";
const SEARCH_PATIO_VOUCHER = `SEARCH_PATIO_VOUCHER${postfix}`;
const SEARCH_PATIO_VOUCHER_SUCCESS = `SEARCH_PATIO_VOUCHER_SUCCESS${postfix}`;
const SEARCH_PATIO_VOUCHER_ERROR = `SEARCH_PATIO_VOUCHER_ERROR${postfix}`;
const SEARCH_PATIO_VOUCHER_RESET = `SEARCH_PATIO_VOUCHER_RESET${postfix}`;


export const searchPatioVoucherAction: ActionFunctionAny<Action<any>> =
  createAction(SEARCH_PATIO_VOUCHER);
export const searchPatioVoucherSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(SEARCH_PATIO_VOUCHER_SUCCESS);
export const searchPatioVoucherErrorAction: ActionFunctionAny<Action<any>> =
  createAction(SEARCH_PATIO_VOUCHER_ERROR);
  export const searchPatioVoucherResetAction: ActionFunctionAny<Action<any>> =
  createAction(SEARCH_PATIO_VOUCHER_RESET);

function* searchPatioVoucherWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readPatioVoucher, id);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(searchPatioVoucherSuccessAction(result));
  } catch (e: any) {
    // const { history } = action.payload;
    const message: string = e.message || resolveError(
      e.response?.data?.message || e.message
    );

    // yield history.push("/vouchers/list");
    yield put(searchPatioVoucherErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
        autoHideDuration: 2000,
      })
    );
  }
}

function* searchPatioVoucherWatcher(): Generator<any, any, any> {
  yield debounce(800, SEARCH_PATIO_VOUCHER, searchPatioVoucherWorker);
  // yield takeLatest(SEARCH_VOUCHER, searchVoucherWorker);
}

const patioVouchersReducerHandlers = {
  [SEARCH_PATIO_VOUCHER_RESET]: (state: any) => {
    return {
      ...state,
      search: {
        loading: false,
        voucher: null,
      },
    };
  },
  [SEARCH_PATIO_VOUCHER]: (state: any) => {
    return {
      ...state,
      search: {
        loading: true,
        voucher: null,
      },
    };
  },
  [SEARCH_PATIO_VOUCHER_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      search: {
        loading: false,
        voucher: action.payload.voucher,
      },
    };
  },
  [SEARCH_PATIO_VOUCHER_ERROR]: (state: any) => {
    return {
      ...state,
      search: {
        loading: false,
        error: true,
      }
    };
  },
};

mergeSaga(searchPatioVoucherWatcher);
patioVouchersReducer.addHandlers(patioVouchersReducerHandlers);
