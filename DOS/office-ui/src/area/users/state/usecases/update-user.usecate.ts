import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { updateUser } from "../../service/user.service";
import { usersReducer } from "../users.reducer";
import { loadUsersAction } from "./load-users.usecase";

const postfix = "/app";
const UPDATE_USER = `UPDATE_USER${postfix}`;
const UPDATE_USER_SUCCESS = `UPDATE_USER_SUCCESS${postfix}`;
const UPDATE_USER_ERROR = `UPDATE_USER_ERROR${postfix}`;

export const updateUserAction: ActionFunctionAny<Action<any>> =
  createAction(UPDATE_USER);
export const updateUserSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(UPDATE_USER_SUCCESS);
export const updateUserErrorAction: ActionFunctionAny<Action<any>> =
  createAction(UPDATE_USER_ERROR);

function* updateUserWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history, id } = action.payload;
    const result = yield call(updateUser, id, fields);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(updateUserSuccessAction(result));
    yield history.push("/users");
    yield put(loadUsersAction());
    yield put(
      notificationAction({
        message: `¡Usuario ${id} ha sido actualizado!`,
      })
    );
  } catch (e: any) {
    // const { releaseForm } = action.payload;
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );

    // yield releaseForm();
    yield put(updateUserErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
  }
}

function* updateUserWatcher(): Generator<any, any, any> {
  yield takeLatest(UPDATE_USER, updateUserWorker);
}

const usersReducerHandlers = {
  [UPDATE_USER]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [UPDATE_USER_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      user: null,
    };
  },
  [UPDATE_USER_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(updateUserWatcher);
usersReducer.addHandlers(usersReducerHandlers);
