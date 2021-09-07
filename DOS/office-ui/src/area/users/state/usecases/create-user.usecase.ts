import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { createUser } from "../../service/user.service";
import { usersReducer } from "../users.reducer";
import { loadUsersAction } from "./load-users.usecase";

const postfix = "/app";
const CREATE_USER = `CREATE_USER${postfix}`;
const CREATE_USER_SUCCESS = `CREATE_USER_SUCCESS${postfix}`;
const CREATE_USER_ERROR = `CREATE_USER_ERROR${postfix}`;

export const createUserAction: ActionFunctionAny<Action<any>> =
  createAction(CREATE_USER);
export const createUserSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(CREATE_USER_SUCCESS);
export const createUserErrorAction: ActionFunctionAny<Action<any>> =
  createAction(CREATE_USER_ERROR);

function* createUserWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history } = action.payload;
    const result = yield call(createUser, fields);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(createUserSuccessAction(result));
    yield history.push("/users");
    yield put(loadUsersAction());
    yield put(
      notificationAction({
        message: `¡Usuario ${result.returnCode} ha sido creado!`,
        type: "success",
      })
    );
  } catch (e: any) {
    // const { releaseForm } = action.payload;
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );

    // yield releaseForm();
    yield put(createUserErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
    yield console.log(e);
  }
}

function* createUserWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_USER, createUserWorker);
}

const userReducerHandlers = {
  [CREATE_USER]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_USER_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      user: null,
    };
  },
  [CREATE_USER_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(createUserWatcher);
usersReducer.addHandlers(userReducerHandlers);
