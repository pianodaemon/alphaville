import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { put, take, takeLatest } from "redux-saga/effects";
import { loadPatiosCatalogAction } from "src/area/patios/state/usecases/load-patios-catalog.usecase";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { TokenStorage } from "src/shared/utils/token-storage.util";
import { authReducer } from "../auth.reducer";
import {
  loadUserProfileAction,
  loadUserProfileErrorAction,
  loadUserProfileSuccessAction,
} from "./load-user-profile.usecase";

const postfix = "/app";
const CHECK_AUTH = `CHECK_AUTH${postfix}`;
const CHECK_AUTH_LOGGED_IN = `CHECK_AUTH_LOGGED_IN${postfix}`;

export const checkAuthAction: ActionFunctionAny<Action<any>> =
  createAction(CHECK_AUTH);
export const checkAuthLoggedInAction: ActionFunctionAny<Action<any>> =
  createAction(CHECK_AUTH_LOGGED_IN);

function* checkAuthWorker(): Generator<any, any, any> {
  try {
    if (TokenStorage.isAuthenticated()) {
      yield put(checkAuthLoggedInAction());
      //User Profile
      yield put(loadUserProfileAction());
      yield put(
        loadPatiosCatalogAction({
          per_page: Number.MAX_SAFE_INTEGER,
        })
      );
      yield take([loadUserProfileSuccessAction, loadUserProfileErrorAction]);
      return;
    }
    // throw new Error('Not Logged In!');
  } catch (e) {
    yield console.log(e, "Authentication Error.");
  }
}

function* checkAuthWatcher(): Generator<any, any, any> {
  yield takeLatest(CHECK_AUTH, checkAuthWorker);
}

const authReducerHandlers = {
  [CHECK_AUTH]: (state: any) => {
    return {
      ...state,
      signedIn: false,
      checked: true,
    };
  },
  [CHECK_AUTH_LOGGED_IN]: (state: any) => {
    return {
      ...state,
      claims: TokenStorage.getTokenClaims(),
      signedIn: true,
      checked: true,
    };
  },
};

mergeSaga(checkAuthWatcher);
authReducer.addHandlers(authReducerHandlers);
