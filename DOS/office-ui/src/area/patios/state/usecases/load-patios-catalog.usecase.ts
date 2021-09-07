import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { getPatios } from "../../service/patio.service";
import { patiosReducer } from "../patios.reducer";
import { pagingSelector } from "../patios.selectors";

const postfix = "/app";
const LOAD_PATIOS_CATALOG = `LOAD_PATIOS_CATALOG${postfix}`;
const LOAD_PATIOS_CATALOG_SUCCESS = `LOAD_PATIOS_CATALOG_SUCCESS${postfix}`;
const LOAD_PATIOS_CATALOG_ERROR = `LOAD_PATIOS_CATALOG_ERROR${postfix}`;

export const loadPatiosCatalogAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_PATIOS_CATALOG);
export const loadPatiosCatalogSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_PATIOS_CATALOG_SUCCESS);
export const loadPatiosCatalogErrorAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_PATIOS_CATALOG_ERROR);

function* loadPatiosCatalogWorker(action?: any): Generator<any, any, any> {
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
    const result = yield call(getPatios, options);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(
      loadPatiosCatalogSuccessAction({
        patios: result.data,
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
    yield put(loadPatiosCatalogErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
  }
}

function* loadPatiosCatalogWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_PATIOS_CATALOG, loadPatiosCatalogWorker);
}

const patiosReducerHandlers = {
  [LOAD_PATIOS_CATALOG]: (state: any) => {
    // const { payload } = action || {};
    // const { filters } = payload || {};
    return {
      ...state,
      // loading: true,
      // filters: filters || {},
      patiosCatalog: null,
    };
  },
  [LOAD_PATIOS_CATALOG_SUCCESS]: (state: any, action: any) => {
    const { patios, /* paging, filters */ } = action.payload;
    return {
      ...state,
      // loading: false,
      patiosCatalog: patios.patioList,
      // paging: { ...paging, },
      // filters,
    };
  },
  [LOAD_PATIOS_CATALOG_ERROR]: (state: any) => {
    return {
      ...state,
      // loading: false,
      error: true,
    };
  },
};

mergeSaga(loadPatiosCatalogWatcher);
patiosReducer.addHandlers(patiosReducerHandlers);
