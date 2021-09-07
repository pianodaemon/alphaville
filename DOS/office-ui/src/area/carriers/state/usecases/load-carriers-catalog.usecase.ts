import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { getCarriers } from "../../service/carrier.service";
import { carriersReducer } from "../carriers.reducer";
import { pagingSelector } from "../carriers.selectors";

const postfix = "/app";
const LOAD_CARRIERS_CATALOG = `LOAD_CARRIERS_CATALOG${postfix}`;
const LOAD_CARRIERS_CATALOG_SUCCESS = `LOAD_CARRIERS_CATALOG_SUCCESS${postfix}`;
const LOAD_CARRIERS_CATALOG_ERROR = `LOAD_CARRIERS_CATALOG_ERROR${postfix}`;

export const loadCarriersCatalogAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_CARRIERS_CATALOG);
export const loadCarriersCatalogSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_CARRIERS_CATALOG_SUCCESS);
export const loadCarriersCatalogErrorAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_CARRIERS_CATALOG_ERROR);

function* loadCarriersCatalogWorker(action?: any): Generator<any, any, any> {
  try {
    const aliases = { id: "id" };
    const { per_page, page, order, order_by, filters } = action.payload || {};
    const paging = yield select(pagingSelector);
    const options = {
      ...action.payload,
      per_page: per_page || paging.per_page,
      page: page || paging.page,
      pages: paging.pages,
      order: order || paging.order,
      order_by: aliases[order_by] || aliases[paging.order_by] || "id",
      ...filters,
    };
    delete options.filters;
    const result = yield call(getCarriers, options);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(
      loadCarriersCatalogSuccessAction({
        carriers: result.data,
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
    yield put(loadCarriersCatalogErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
  }
}

function* loadCarriersCatalogWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_CARRIERS_CATALOG, loadCarriersCatalogWorker);
}

const carriersReducerHandlers = {
  [LOAD_CARRIERS_CATALOG]: (state: any) => {
    // const { payload } = action || {};
    // const { filters } = payload || {};
    return {
      ...state,
      // loading: true,
      // filters: filters || {},
      carriersCatalog: null,
    };
  },
  [LOAD_CARRIERS_CATALOG_SUCCESS]: (state: any, action: any) => {
    const { carriers, /* paging, filters */ } = action.payload;
    return {
      ...state,
      // loading: false,
      carriersCatalog: carriers.carrierList,
      // paging: {...paging,},
      // filters,
    };
  },
  [LOAD_CARRIERS_CATALOG_ERROR]: (state: any) => {
    return {
      ...state,
      // loading: false,
      // error: true,
    };
  },
};

mergeSaga(loadCarriersCatalogWatcher);
carriersReducer.addHandlers(carriersReducerHandlers);
