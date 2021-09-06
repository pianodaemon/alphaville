import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { readUser } from "../../service/user.service";
import { usersReducer } from "../users.reducer";

const postfix = "/app";
const READ_USER = `READ_USER${postfix}`;
const READ_USER_SUCCESS = `READ_USER_SUCCESS${postfix}`;
const READ_USER_ERROR = `READ_USER_ERROR${postfix}`;

export const readUserAction: ActionFunctionAny<Action<any>> =
  createAction(READ_USER);
export const readUserSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(READ_USER_SUCCESS);
export const readUserErrorAction: ActionFunctionAny<Action<any>> =
  createAction(READ_USER_ERROR);

function* readUserWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readUser, id);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(readUserSuccessAction(result));
  } catch (e: any) {
    const { history } = action.payload;
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );

    yield history.push("/user/list");
    yield put(readUserErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
  }
}

function* readUserWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_USER, readUserWorker);
}

const usersReducerHandlers = {
  [READ_USER]: (state: any) => {
    return {
      ...state,
      loading: true,
      user: null,
    };
  },
  [READ_USER_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      user: action.payload.user,
    };
  },
  [READ_USER_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(readUserWatcher);
usersReducer.addHandlers(usersReducerHandlers);
