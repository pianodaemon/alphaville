import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { resolveError } from "src/shared/utils/resolve-error.util";
import { TokenStorage } from "src/shared/utils/token-storage.util";
import { logout } from "../../service/auth.service";
import { authReducer } from "../auth.reducer";

const postfix = "/app";
const LOGOUT = `LOGOUT${postfix}`;
const LOGOUT_SUCCESS = `LOGOUT_SUCCESS${postfix}`;
const LOGOUT_ERROR = `LOGOUT_ERROR${postfix}`;

export const logoutAction: ActionFunctionAny<Action<any>> =
  createAction(LOGOUT);
export const logoutSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(LOGOUT_SUCCESS);
export const logoutErrorAction: ActionFunctionAny<Action<any>> =
  createAction(LOGOUT_ERROR);

function* logoutWorker(action: any): Generator<any, any, any> {
  try {
    const { history } = action.payload;
    yield call(logout);
    yield TokenStorage.clear();
    yield put(logoutSuccessAction());
    yield history.push("/sign-in");
    yield put(
      notificationAction({
        message: `¡Sesión terminada con éxito!`,
        type: "success",
      })
    );
  } catch (e: any) {
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );
    /* @todo add below code to axios response interceptor
    let httpCode = e.response?.status ? e.response.status  : 0;
    if (httpCode === 401) {
      yield removeAuthCookie();
      yield put(
        notificationAction({
          message: 'Petición inválida. Su sesión ha sido terminada. Ingrese por favor sus credenciales.',
          type: 'error',
        })
      );
      return;
    }
    */
    yield put(logoutErrorAction(e));
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
    yield console.log(e);
  }
}

function* logoutWatcher(): Generator<any, any, any> {
  yield takeLatest(LOGOUT, logoutWorker);
}

const authReducerHandlers = {
  [LOGOUT]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [LOGOUT_SUCCESS]: (state: any) => {
    return {
      ...state,
      claims: null,
      loading: false,
      token: null,
      signedIn: false,
    };
  },
  [LOGOUT_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      error: action.payload,
      loading: false,
      // signedIn: false,
    };
  },
};

mergeSaga(logoutWatcher);
authReducer.addHandlers(authReducerHandlers);
