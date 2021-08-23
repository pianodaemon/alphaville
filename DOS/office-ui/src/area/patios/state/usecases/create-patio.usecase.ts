import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
// import { translations } from 'src/shared/translations/translations.util';
import { createPatio } from '../../service/patio.service';
import { patiosReducer } from '../patios.reducer';
import { loadPatiosAction } from './load-patios.usecase';

const postfix = '/app';
const CREATE_PATIO = `CREATE_PATIO${postfix}`;
const CREATE_PATIO_SUCCESS = `CREATE_PATIO_SUCCESS${postfix}`;
const CREATE_PATIO_ERROR = `CREATE_PATIO_ERROR${postfix}`;

export const createPatioAction: ActionFunctionAny<Action<any>> = createAction(
  CREATE_PATIO
);
export const createPatioSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_PATIO_SUCCESS);
export const createPatioErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_PATIO_ERROR);

function* createPatioWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history } = action.payload;
    const result = yield call(createPatio, fields);
    yield put(createPatioSuccessAction(result));
    yield history.push('/patios');
    yield put(loadPatiosAction());
    yield put(
      notificationAction({
        message: `¡Patio ${result.returnCode} ha sido creado!`,
        type: 'success',
      })
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
    yield put(createPatioErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* createPatioWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_PATIO, createPatioWorker);
}

const patioReducerHandlers = {
  [CREATE_PATIO]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_PATIO_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      patio: null,
    };
  },
  [CREATE_PATIO_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(createPatioWatcher);
patiosReducer.addHandlers(patioReducerHandlers);
