import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { TokenStorage } from "src/shared/utils/token-storage.util";
import { resolveError } from "src/shared/utils/resolve-error.util";
import { checkAuthAction } from "./check-auth.usecase";
import { login } from "../../service/auth.service";
import { authReducer } from "../auth.reducer";

const postfix = "/app";
const AUTH_TOKEN = `AUTH_TOKEN${postfix}`;
const AUTH_TOKEN_SUCCESS = `AUTH_TOKEN_SUCCESS${postfix}`;
const AUTH_TOKEN_ERROR = `AUTH_TOKEN_ERROR${postfix}`;

export const authTokenAction: ActionFunctionAny<Action<any>> =
  createAction(AUTH_TOKEN);
export const authTokenSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(AUTH_TOKEN_SUCCESS);
export const authTokenErrorAction: ActionFunctionAny<Action<any>> =
  createAction(AUTH_TOKEN_ERROR);

function* authTokenWorker(action: any): Generator<any, any, any> {
  try {
    const { credentials, history } = action.payload;
    const result = yield call(login, credentials);
    const { token } = result.data;
    yield TokenStorage.storeToken(token);
    yield put(authTokenSuccessAction(token));
    yield put(checkAuthAction());
    yield put(
      notificationAction({
        message: `¡Bienvenido!`,
        type: "success",
      })
    );
    history.push("/start");
  } catch (e: any) {
    // const { releaseForm } = action.payload;
    const message: string = resolveError(
      e.response?.data?.message ||
        (e.response?.data?.errors && e.response?.data?.errors[0].title) ||
        e.message
    );
    // yield releaseForm();
    yield put(authTokenErrorAction(e));
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
    yield console.log(e);
  }
}

function* authTokenWatcher(): Generator<any, any, any> {
  yield takeLatest(AUTH_TOKEN, authTokenWorker);
}

const authReducerHandlers = {
  [AUTH_TOKEN]: (state: any) => {
    return {
      ...state,
      loading: true,
      signedIn: false,
    };
  },
  [AUTH_TOKEN_SUCCESS]: (state: any, action: any) => {
    // const { token } = action.payload;
    return {
      ...state,
      claims: TokenStorage.getTokenClaims(),
      loading: false,
      signedIn: true,
    };
  },
  [AUTH_TOKEN_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      error: action.payload,
      loading: false,
      signedIn: false,
    };
  },
};

mergeSaga(authTokenWatcher);
authReducer.addHandlers(authReducerHandlers);
