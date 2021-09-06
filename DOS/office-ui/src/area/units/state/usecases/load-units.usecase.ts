import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { getUnits } from "../../service/unit.service";
import { unitsReducer } from "../units.reducer";
import { pagingSelector } from "../units.selectors";

const postfix = "/app";
const LOAD_UNITS = `LOAD_UNITS${postfix}`;
const LOAD_UNITS_SUCCESS = `LOAD_UNITS_SUCCESS${postfix}`;
const LOAD_UNITS_ERROR = `LOAD_UNITS_ERROR${postfix}`;

export const loadUnitsAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_UNITS);
export const loadUnitsSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_UNITS_SUCCESS);
export const loadUnitsErrorAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_UNITS_ERROR);

function* loadUnitsWorker(action?: any): Generator<any, any, any> {
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
    const result = yield call(getUnits, options);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(
      loadUnitsSuccessAction({
        units: result.data,
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

    yield put(loadUnitsErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
  }
}

function* loadUnitsWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_UNITS, loadUnitsWorker);
}

const unitsReducerHandlers = {
  [LOAD_UNITS]: (state: any, action) => {
    const { payload } = action || {};
    const { filters } = payload || {};
    return {
      ...state,
      loading: true,
      filters: filters || {},
      unit: null,
    };
  },
  [LOAD_UNITS_SUCCESS]: (state: any, action: any) => {
    const { units, paging, filters } = action.payload;
    return {
      ...state,
      loading: false,
      units: units.unitList,
      paging: {
        ...paging,
      },
      filters,
    };
  },
  [LOAD_UNITS_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadUnitsWatcher);
unitsReducer.addHandlers(unitsReducerHandlers);
