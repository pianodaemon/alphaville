import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { userIsComunSelector } from "src/area/auth/state/auth.selectors";
import { downloadExcelFile } from "src/shared/utils/download-excel-file.util";
import { getVouchers } from "../../service/voucher.service";
import { vouchersReducer } from "../vouchers.reducer";
import { appliedFiltersSelector, downloadedVouchersSelector, pagingSelector } from "../vouchers.selectors";

const postfix = "/app";
const DOWNLOAD_VOUCHERS = `DOWNLOAD_VOUCHERS${postfix}`;
const DOWNLOAD_VOUCHERS_SUCCESS = `DOWNLOAD_VOUCHERS_SUCCESS${postfix}`;
const DOWNLOAD_VOUCHERS_ERROR = `DOWNLOAD_VOUCHERS_ERROR${postfix}`;

export const downloadVouchersAction: ActionFunctionAny<Action<any>> =
  createAction(DOWNLOAD_VOUCHERS);
export const downloadVouchersSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(DOWNLOAD_VOUCHERS_SUCCESS);
export const downloadVouchersErrorAction: ActionFunctionAny<Action<any>> =
  createAction(DOWNLOAD_VOUCHERS_ERROR);

function* downloadVouchersWorker(action?: any): Generator<any, any, any> {
  try {
    const aliases = { id: "id", carrierCode: "code", platform: "platform" };
    const { clearFilters, order, order_by, filters } =
      action.payload || {};
    const appliedFilters = yield select(appliedFiltersSelector);
    const isComun = yield select(userIsComunSelector);
    const paging = yield select(pagingSelector);
    const options = {
      ...action.payload,
      per_page: Number.MAX_SAFE_INTEGER,
      order: order || paging.order,
      order_by: aliases[order_by] || aliases[paging.order_by] || order_by,
      ...((filters && Object.keys(filters).length > 0) || clearFilters
        ? filters
        : appliedFilters),
      ...isComun,
    };
    delete options.filters;
    const result = yield call(getVouchers, options);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(
      downloadVouchersSuccessAction({
        vouchers: result.data,
      })
    );
    const rows = yield select(downloadedVouchersSelector);
    yield downloadExcelFile(rows);
  } catch (e: any) {
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );
    console.log("Error:", e);
    yield put(downloadVouchersErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
  }
}

function* downloadVouchersWatcher(): Generator<any, any, any> {
  yield takeLatest(DOWNLOAD_VOUCHERS, downloadVouchersWorker);
}

const vouchersReducerHandlers = {
  [DOWNLOAD_VOUCHERS]: (state: any, action) => {
    // const { payload } = action || {};
    // const { filters } = payload || {};
    return {
      ...state,
      downloading: true,
      downloadedVouchers: null,
    };
  },
  [DOWNLOAD_VOUCHERS_SUCCESS]: (state: any, action: any) => {
    const { vouchers } = action.payload;
    return {
      ...state,
      downloading: false,
      downloadedVouchers: vouchers.voucherList,
    };
  },
  [DOWNLOAD_VOUCHERS_ERROR]: (state: any) => {
    return {
      ...state,
      downloading: false,
      error: true,
    };
  },
};

mergeSaga(downloadVouchersWatcher);
vouchersReducer.addHandlers(vouchersReducerHandlers);
