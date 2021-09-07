import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { getUsers } from "../../service/user.service";
import { usersReducer } from "../users.reducer";
import { pagingSelector } from "../users.selectors";

const postfix = "/app";
const LOAD_USERS_AS_CATALOG = `LOAD_USERS_AS_CATALOG${postfix}`;
const LOAD_USERS_AS_CATALOG_SUCCESS = `LOAD_USERS_AS_CATALOG_SUCCESS${postfix}`;
const LOAD_USERS_AS_CATALOG_ERROR = `LOAD_USERS_AS_CATALOG_ERROR${postfix}`;

export const loadUsersAsCatalogAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_USERS_AS_CATALOG);
export const loadUsersAsCatalogASuccessAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_USERS_AS_CATALOG_SUCCESS);
export const loadUsersAsCatalogErrorAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_USERS_AS_CATALOG_ERROR);

function* loadUsersAsCatalogWorker(action?: any): Generator<any, any, any> {
  try {
    const aliases = { userId: "id", username: "username" };
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
    const result = yield call(getUsers, options);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(
      loadUsersAsCatalogASuccessAction({
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
      })
    );
  } catch (e: any) {
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );

    yield put(loadUsersAsCatalogErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
  }
}

function* loadUsersAsCatalogWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_USERS_AS_CATALOG, loadUsersAsCatalogWorker);
}

const usersReducerHandlers = {
  [LOAD_USERS_AS_CATALOG]: (state: any, action) => {
    // const { payload } = action || {};
    // const { filters } = payload || {};
    return {
      ...state,
      // loading: true,
      // filters: filters || {},
      usersCatalog: null,
    };
  },
  [LOAD_USERS_AS_CATALOG_SUCCESS]: (state: any, action: any) => {
    const { users, /* paging, filters */ } = action.payload;
    return {
      ...state,
      // loading: false,
      usersCatalog: users.userList,
      // paging: { ...paging, },
      // filters,
    };
  },
  [LOAD_USERS_AS_CATALOG_ERROR]: (state: any) => {
    return {
      ...state,
      // loading: false,
      error: true,
    };
  },
};

mergeSaga(loadUsersAsCatalogWatcher);
usersReducer.addHandlers(usersReducerHandlers);
