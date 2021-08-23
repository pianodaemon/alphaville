import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
// import { translations } from 'src/shared/translations/translations.util';
import { updatePatio } from '../../service/patio.service';
import { patiosReducer } from '../patios.reducer';
import { loadPatiosAction } from './load-patios.usecase';

const postfix = '/app';
const UPDATE_PATIO = `UPDATE_PATIO${postfix}`;
const UPDATE_PATIO_SUCCESS = `UPDATE_PATIO_SUCCESS${postfix}`;
const UPDATE_PATIO_ERROR = `UPDATE_PATIO_ERROR${postfix}`;

export const updatePatioAction: ActionFunctionAny<Action<any>> = createAction(
  UPDATE_PATIO
);
export const updatePatioSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_PATIO_SUCCESS);
export const updatePatioErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_PATIO_ERROR);

function* updatePatioWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history, id } = action.payload;
    const result = yield call(updatePatio, id, fields);
    yield put(updatePatioSuccessAction(result));
    yield history.push('/patios');
    yield put(loadPatiosAction());
    yield put(
      notificationAction({
        message: `¡Patio ${id} ha sido actualizado!`,
      }),
    );
  } catch (e) {
    const { releaseForm } = action.payload;
    let message: string =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    /*
        message = message.includes(
      translations.users.error_responses.users_unique_username
    )
      ? translations.users.error_responses.users_unique_username_message
      : message;
      */
    yield releaseForm();
    yield put(updatePatioErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* updatePatioWatcher(): Generator<any, any, any> {
  yield takeLatest(UPDATE_PATIO, updatePatioWorker);
}

const patiosReducerHandlers = {
  [UPDATE_PATIO]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [UPDATE_PATIO_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      patio: null,
    };
  },
  [UPDATE_PATIO_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(updatePatioWatcher);
patiosReducer.addHandlers(patiosReducerHandlers);
