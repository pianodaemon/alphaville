import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, select, takeLatest, delay } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { getUsers } from '../../service/user.service';
import { usersReducer } from '../users.reducer';
import { pagingSelector } from '../users.selectors';

const postfix = '/app';
const LOAD_USERS = `LOAD_USERS${postfix}`;
const LOAD_USERS_SUCCESS = `LOAD_USERS_SUCCESS${postfix}`;
const LOAD_USERS_ERROR = `LOAD_USERS_ERROR${postfix}`;

export const loadUsersAction: ActionFunctionAny<Action<any>> = createAction(
  LOAD_USERS
);
export const loadUsersSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_USERS_SUCCESS);
export const loadUsersErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(LOAD_USERS_ERROR);

function* loadUsersWorker(action?: any): Generator<any, any, any> {
  try {
    const aliases = {userId: "id", username: 'username'};
    const { per_page, page, order, order_by, filters } = action.payload || {};
    const paging = yield select(pagingSelector);
    const options = {
      ...action.payload,
      per_page: per_page || paging.per_page,
      page: page || paging.page,
      pages: paging.pages,
      order: order || paging.order,
      order_by: aliases[order_by] || aliases[paging.order_by],
      ...filters,
    };
    delete options.filters;
    const result = yield call(getUsers, options);
    yield delay(500);
    yield put(
      loadUsersSuccessAction({
        users: result.data,
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
    yield put(loadUsersErrorAction());
  }
}

function* loadUsersWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_USERS, loadUsersWorker);
}

const usersReducerHandlers = {
  [LOAD_USERS]: (state: any, action) => {
    return {
      ...state,
      loading: true,
      filters: action.payload.filters,
    };
  },
  [LOAD_USERS_SUCCESS]: (state: any, action: any) => {
    const { users, paging, filters } = action.payload;
    return {
      ...state,
      loading: false,
      users: users.userList,
      paging: {
        ...paging,
      },
      filters,
    };
  },
  [LOAD_USERS_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadUsersWatcher);
usersReducer.addHandlers(usersReducerHandlers);
