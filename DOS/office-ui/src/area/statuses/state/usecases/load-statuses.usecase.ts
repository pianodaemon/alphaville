import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { getStatuses } from "../../service/status.service";
import { statusesReducer } from "../statuses.reducer";
import { pagingSelector } from "../statuses.selectors";

const postfix = "/app";
const LOAD_STATUSES = `LOAD_STATUSES${postfix}`;
const LOAD_STATUSES_SUCCESS = `LOAD_STATUSES_SUCCESS${postfix}`;
const LOAD_STATUSES_ERROR = `LOAD_STATUSES_ERROR${postfix}`;

export const loadStatusesAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_STATUSES);
export const loadStatusesSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_STATUSES_SUCCESS);
export const loadStatusesErrorAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_STATUSES_ERROR);

function* loadStatusesWorker(action?: any): Generator<any, any, any> {
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
    const result = yield call(getStatuses, options);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(
      loadStatusesSuccessAction({
        statuses: result.data,
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
    yield put(loadStatusesErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
  }
}

function* loadStatusesWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_STATUSES, loadStatusesWorker);
}

const statusesReducerHandlers = {
  [LOAD_STATUSES]: (state: any, action) => {
    const { payload } = action || {};
    const { filters } = payload || {};
    return {
      ...state,
      loading: true,
      filters: filters || {},
      status: null,
    };
  },
  [LOAD_STATUSES_SUCCESS]: (state: any, action: any) => {
    const { statuses, paging, filters } = action.payload;
    return {
      ...state,
      loading: false,
      statuses: statuses.statusList,
      paging: {
        ...paging,
      },
      filters,
    };
  },
  [LOAD_STATUSES_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadStatusesWatcher);
statusesReducer.addHandlers(statusesReducerHandlers);
