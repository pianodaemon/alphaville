import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest, delay } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getCarriers } from '../../service/carrier.service';
import { carriersReducer } from '../carriers.reducer';
import { pagingSelector } from '../carriers.selectors';

const postfix = '/app';
const LOAD_CARRIERS = `LOAD_CARRIERS${postfix}`;
const LOAD_CARRIERS_SUCCESS = `LOAD_CARRIERS_SUCCESS${postfix}`;
const LOAD_CARRIERS_ERROR = `LOAD_CARRIERS_ERROR${postfix}`;

export const loadCarriersAction: ActionFunctionAny<Action<any>> = createAction(
  LOAD_CARRIERS
);
export const loadCarriersSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CARRIERS_SUCCESS);
export const loadCarriersErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_CARRIERS_ERROR);

function* loadCarriersWorker(action?: any): Generator<any, any, any> {
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
    const result = yield call(getCarriers, options);
    yield delay(500);
    yield put(
      loadCarriersSuccessAction({
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
      }),
    );
  } catch (e) {
    yield put(loadCarriersErrorAction());
  }
}

function* loadCarriersWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_CARRIERS, loadCarriersWorker);
}

const carriersReducerHandlers = {
  [LOAD_CARRIERS]: (state: any, action) => {
    const { payload } = action || {};
    const { filters } = payload || {};
    return {
      ...state,
      loading: true,
      filters: filters || {},
      carrier: null,
    };
  },
  [LOAD_CARRIERS_SUCCESS]: (state: any, action: any) => {
    const { carriers, paging, filters } = action.payload;
    return {
      ...state,
      loading: false,
      carriers: carriers.carrierList,
      paging: {
        ...paging,
      },
      filters,
    };
  },
  [LOAD_CARRIERS_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadCarriersWatcher);
carriersReducer.addHandlers(carriersReducerHandlers);
