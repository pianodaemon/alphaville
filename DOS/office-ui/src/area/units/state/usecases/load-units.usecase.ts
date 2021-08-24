import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest, delay } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getUnits } from '../../service/unit.service';
import { unitsReducer } from '../units.reducer';
import { pagingSelector } from '../units.selectors';

const postfix = '/app';
const LOAD_UNITS = `LOAD_UNITS${postfix}`;
const LOAD_UNITS_SUCCESS = `LOAD_UNITS_SUCCESS${postfix}`;
const LOAD_UNITS_ERROR = `LOAD_UNITS_ERROR${postfix}`;

export const loadUnitsAction: ActionFunctionAny<Action<any>> = createAction(
  LOAD_UNITS
);
export const loadUnitsSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_UNITS_SUCCESS);
export const loadUnitsErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_UNITS_ERROR);

function* loadUnitsWorker(action?: any): Generator<any, any, any> {
  try {
    const aliases = {id: "id",};
    const { per_page, page, order, order_by, filters } = action.payload || {};
    const paging = yield select(pagingSelector);
    const options = {
      ...action.payload,
      per_page: per_page || paging.per_page,
      page: page || paging.page,
      pages: paging.pages,
      order: order || paging.order,
      order_by: aliases[order_by] || aliases[paging.order_by] || 'id',
      ...filters,
    };
    delete options.filters;
    const result = yield call(getUnits, options);
    yield delay(500);
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
      }),
    );
  } catch (e) {
    yield put(loadUnitsErrorAction());
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
