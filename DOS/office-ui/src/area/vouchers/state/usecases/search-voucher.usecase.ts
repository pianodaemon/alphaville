import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, debounce, put } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { getVouchers, readVoucher } from "../../service/voucher.service";
import { vouchersReducer } from "../vouchers.reducer";

const postfix = "/app";
const SEARCH_VOUCHER = `SEARCH_VOUCHER${postfix}`;
const SEARCH_VOUCHER_SUCCESS = `SEARCH_VOUCHER_SUCCESS${postfix}`;
const SEARCH_VOUCHER_ERROR = `SEARCH_VOUCHER_ERROR${postfix}`;
const SEARCH_VOUCHER_RESET = `SEARCH_VOUCHER_RESET${postfix}`;

export const searchVoucherAction: ActionFunctionAny<Action<any>> =
  createAction(SEARCH_VOUCHER);
export const searchVoucherSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(SEARCH_VOUCHER_SUCCESS);
export const searchVoucherErrorAction: ActionFunctionAny<Action<any>> =
  createAction(SEARCH_VOUCHER_ERROR);
export const searchVoucherResetAction: ActionFunctionAny<Action<any>> =
  createAction(SEARCH_VOUCHER_RESET);

function* searchVoucherWorker(action: any): Generator<any, any, any> {
  const { id, platform } = action.payload;
  const type = id ? "voucher" : "platform";
  try {
    const result = yield id
      ? call(readVoucher, id)
      : call(getVouchers, { platform });
    const res = id ? result : result.data;
    if (res && res.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(res.returnMessage);
    }
    yield put(searchVoucherSuccessAction({ ...res, type }));
  } catch (e: any) {
    // const { history } = action.payload;
    const message: string =
      type === "voucher"
        ? e.message
        : resolveError(e.response?.data?.message || e.message);
    console.log(message, e.message);

    // yield history.push("/vouchers/list");
    yield put(searchVoucherErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
        autoHideDuration: 2000,
      })
    );
  }
}

function* searchVoucherWatcher(): Generator<any, any, any> {
  yield debounce(800, SEARCH_VOUCHER, searchVoucherWorker);
  // yield takeLatest(SEARCH_VOUCHER, searchVoucherWorker);
}

const vouchersReducerHandlers = {
  [SEARCH_VOUCHER_RESET]: (state: any) => {
    return {
      ...state,
      search: {
        loading: false,
        voucher: null,
      },
    };
  },
  [SEARCH_VOUCHER]: (state: any) => {
    return {
      ...state,
      search: {
        loading: true,
        voucher: null,
      },
    };
  },
  [SEARCH_VOUCHER_SUCCESS]: (state: any, action: any) => {
    const { type, voucherList, voucher } = action.payload;
    return {
      ...state,
      search: {
        loading: false,
        voucher: type === "voucher" ? voucher : voucherList[0],
      },
    };
  },
  [SEARCH_VOUCHER_ERROR]: (state: any) => {
    return {
      ...state,
      search: {
        loading: false,
        error: true,
      },
    };
  },
};

mergeSaga(searchVoucherWatcher);
vouchersReducer.addHandlers(vouchersReducerHandlers);
