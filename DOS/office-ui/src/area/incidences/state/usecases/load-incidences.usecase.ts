import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { getIncidences } from "../../service/incidence.service";
import { incidencesReducer } from "../incidences.reducer";
import { pagingSelector } from "../incidences.selectors";

const postfix = "/app";
const LOAD_INCIDENCES = `LOAD_INCIDENCES${postfix}`;
const LOAD_INCIDENCES_SUCCESS = `LOAD_INCIDENCES_SUCCESS${postfix}`;
const LOAD_INCIDENCES_ERROR = `LOAD_INCIDENCES_ERROR${postfix}`;

export const loadIncidencesAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_INCIDENCES);
export const loadIncidencesSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_INCIDENCES_SUCCESS);
export const loadIncidencesErrorAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_INCIDENCES_ERROR);

function* loadIncidencesWorker(action?: any): Generator<any, any, any> {
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
    const result = yield call(getIncidences, options);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(
      loadIncidencesSuccessAction({
        incidences: result.data,
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
    yield put(loadIncidencesErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
  }
}

function* loadIncidencesWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_INCIDENCES, loadIncidencesWorker);
}

const incidencesReducerHandlers = {
  [LOAD_INCIDENCES]: (state: any, action) => {
    const { payload } = action || {};
    const { filters } = payload || {};
    return {
      ...state,
      loading: true,
      filters: filters || {},
      incidence: null,
    };
  },
  [LOAD_INCIDENCES_SUCCESS]: (state: any, action: any) => {
    const { incidences, paging, filters } = action.payload;
    return {
      ...state,
      loading: false,
      incidences: incidences.incidenceList,
      paging: {
        ...paging,
      },
      filters,
    };
  },
  [LOAD_INCIDENCES_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadIncidencesWatcher);
incidencesReducer.addHandlers(incidencesReducerHandlers);
