import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { getVouchers } from "../../service/voucher.service";
import { vouchersReducer } from "../vouchers.reducer";
import { pagingSelector } from "../vouchers.selectors";

const postfix = "/app";
const LOAD_VOUCHERS = `LOAD_VOUCHERS${postfix}`;
const LOAD_VOUCHERS_SUCCESS = `LOAD_VOUCHERS_SUCCESS${postfix}`;
const LOAD_VOUCHERS_ERROR = `LOAD_VOUCHERS_ERROR${postfix}`;

export const loadVouchersAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_VOUCHERS);
export const loadVouchersSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_VOUCHERS_SUCCESS);
export const loadVouchersErrorAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_VOUCHERS_ERROR);

function* loadVouchersWorker(action?: any): Generator<any, any, any> {
  try {
    const aliases = { id: "id", carrierCode: "code", platform: "platform" };
    const { per_page, page, order, order_by, filters } = action.payload || {};
    const paging = yield select(pagingSelector);
    const options = {
      ...action.payload,
      per_page: per_page || paging.per_page,
      page: page || paging.page,
      pages: paging.pages,
      order: order || paging.order,
      order_by: aliases[order_by] || aliases[paging.order_by] || order_by,
      ...filters,
    };
    delete options.filters;
    const result = yield call(getVouchers, options);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(
      loadVouchersSuccessAction({
        vouchers: result.data,
        paging: {
          count: parseInt(result.data.totalItems, 10) || 0,
          pages: parseInt(result.data.totalPages, 10) || 0,
          page: page || paging.page,
          per_page: per_page || paging.per_page,
          order: order || paging.order,
          order_by: order_by || paging.order_by,
        },
        filters,
      })
    );
  } catch (e: any) {
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );
    yield put(loadVouchersErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
  }
}

function* loadVouchersWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_VOUCHERS, loadVouchersWorker);
}

const vouchersReducerHandlers = {
  [LOAD_VOUCHERS]: (state: any, action) => {
    const { payload } = action || {};
    const { filters } = payload || {};
    return {
      ...state,
      loading: true,
      filters: filters || {},
      voucher: null,
    };
  },
  [LOAD_VOUCHERS_SUCCESS]: (state: any, action: any) => {
    const { vouchers, paging, filters } = action.payload;
    return {
      ...state,
      loading: false,
      vouchers: vouchers.voucherList,
      paging: {
        ...paging,
      },
      filters,
    };
  },
  [LOAD_VOUCHERS_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadVouchersWatcher);
vouchersReducer.addHandlers(vouchersReducerHandlers);
