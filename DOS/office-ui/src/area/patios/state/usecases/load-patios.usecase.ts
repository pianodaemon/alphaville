import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { getPatios } from "../../service/patio.service";
import { patiosReducer } from "../patios.reducer";
import { pagingSelector } from "../patios.selectors";

const postfix = "/app";
const LOAD_PATIOS = `LOAD_PATIOS${postfix}`;
const LOAD_PATIOS_SUCCESS = `LOAD_PATIOS_SUCCESS${postfix}`;
const LOAD_PATIOS_ERROR = `LOAD_PATIOS_ERROR${postfix}`;

export const loadPatiosAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_PATIOS);
export const loadPatiosSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_PATIOS_SUCCESS);
export const loadPatiosErrorAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_PATIOS_ERROR);

function* loadPatiosWorker(action?: any): Generator<any, any, any> {
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
      loadPatiosSuccessAction({
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
    yield put(loadPatiosErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
  }
}

function* loadPatiosWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_PATIOS, loadPatiosWorker);
}

const patiosReducerHandlers = {
  [LOAD_PATIOS]: (state: any, action) => {
    const { payload } = action || {};
    const { filters } = payload || {};
    return {
      ...state,
      loading: true,
      filters: filters || {},
      patio: null,
    };
  },
  [LOAD_PATIOS_SUCCESS]: (state: any, action: any) => {
    const { patios, paging, filters } = action.payload;
    return {
      ...state,
      loading: false,
      patios: patios.patioList,
      paging: {
        ...paging,
      },
      filters,
    };
  },
  [LOAD_PATIOS_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadPatiosWatcher);
patiosReducer.addHandlers(patiosReducerHandlers);
