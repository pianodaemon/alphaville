import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { getPatioVouchers } from "../../service/patio-voucher.service";
import { patioVouchersReducer } from "../patio-vouchers.reducer";
import { pagingSelector } from "../patio-vouchers.selectors";

const postfix = "/app";
const LOAD_PATIO_VOUCHERS = `LOAD_PATIO_VOUCHERS${postfix}`;
const LOAD_PATIO_VOUCHERS_SUCCESS = `LOAD_PATIO_VOUCHERS_SUCCESS${postfix}`;
const LOAD_PATIO_VOUCHERS_ERROR = `LOAD_PATIO_VOUCHERS_ERROR${postfix}`;

export const loadPatioVouchersAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_PATIO_VOUCHERS);
export const loadPatioVouchersSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_PATIO_VOUCHERS_SUCCESS);
export const loadPatioVouchersErrorAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_PATIO_VOUCHERS_ERROR);

function* loadPatioVouchersWorker(action?: any): Generator<any, any, any> {
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
    const result = yield call(getPatioVouchers, options);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(
      loadPatioVouchersSuccessAction({
        patioVouchers: result.data,
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
    yield put(loadPatioVouchersErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
  }
}

function* loadPatioVouchersWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_PATIO_VOUCHERS, loadPatioVouchersWorker);
}

const patioVouchersReducerHandlers = {
  [LOAD_PATIO_VOUCHERS]: (state: any, action) => {
    const { payload } = action || {};
    const { filters } = payload || {};
    return {
      ...state,
      loading: true,
      filters: filters || {},
      patioVoucher: null,
    };
  },
  [LOAD_PATIO_VOUCHERS_SUCCESS]: (state: any, action: any) => {
    const { patioVouchers, paging, filters } = action.payload;
    return {
      ...state,
      loading: false,
      patioVouchers: patioVouchers.patioVoucherList,
      paging: {
        ...paging,
      },
      filters,
    };
  },
  [LOAD_PATIO_VOUCHERS_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadPatioVouchersWatcher);
patioVouchersReducer.addHandlers(patioVouchersReducerHandlers);
