import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { getCatalog } from "../../service/catalog.service";
import { usersReducer } from "../users.reducer";

const postfix = "/app";
const LOAD_USERS_CATALOG = `LOAD_USERS_CATALOG${postfix}`;
const LOAD_USERS_CATALOG_SUCCESS = `LOAD_USERS_CATALOG_SUCCESS${postfix}`;
const LOAD_USERS_CATALOG_ERROR = `LOAD_USERS_CATALOG_ERROR${postfix}`;

export const loadUsersCatalogAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_USERS_CATALOG);
export const loadUsersCatalogSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_USERS_CATALOG_SUCCESS);
export const loadUsersCatalogErrorAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_USERS_CATALOG_ERROR);

function* loadUsersCatalogWorker(): Generator<any, any, any> {
  try {
    const result = yield call(getCatalog);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(loadUsersCatalogSuccessAction(result));
  } catch (e: any) {
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );

    yield put(loadUsersCatalogErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
  }
}

function* loadUsersCatalogWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_USERS_CATALOG, loadUsersCatalogWorker);
}

const usersReducerHandlers = {
  [LOAD_USERS_CATALOG]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOAD_USERS_CATALOG_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      catalog: action.payload,
      loading: false,
    };
  },
  [LOAD_USERS_CATALOG_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadUsersCatalogWatcher);
usersReducer.addHandlers(usersReducerHandlers);
