import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { deleteUser } from '../../service/user.service';
import { usersReducer } from '../users.reducer';
import { loadUsersAction } from './load-users.usecase';

const postfix = '/app';
const DELETE_USER = `DELETE_USER${postfix}`;
const DELETE_USER_SUCCESS = `DELETE_USER_SUCCESS${postfix}`;
const DELETE_USER_ERROR = `DELETE_USER_ERROR${postfix}`;

export const deleteUserAction: ActionFunctionAny<Action<any>> = createAction(
  DELETE_USER
);
export const deleteUserSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(DELETE_USER_SUCCESS);
export const deleteUserErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(DELETE_USER_ERROR);

function* deleteUserWorker(action: any): Generator<any, any, any> {
  try {
    const result = yield call(deleteUser, action.payload);
    yield put(deleteUserSuccessAction(result));
    yield put(loadUsersAction());
    yield put(
      notificationAction({
        message: `¡Usuario ${action.payload} ha sido eliminado!`,
      }),
    );
  } catch (e) {
    const message =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    yield put(deleteUserErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      }),
    );
    yield console.log(e);
  }
}

function* deleteUserWatcher(): Generator<any, any, any> {
  yield takeLatest(DELETE_USER, deleteUserWorker);
}

const usersReducerHandlers = {
  [DELETE_USER]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [DELETE_USER_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [DELETE_USER_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(deleteUserWatcher);
usersReducer.addHandlers(usersReducerHandlers);
