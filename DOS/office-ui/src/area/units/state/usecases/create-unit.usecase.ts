import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
// import { translations } from 'src/shared/translations/translations.util';
import { createUnit } from '../../service/unit.service';
import { unitsReducer } from '../units.reducer';
import { loadUnitsAction } from './load-units.usecase';

const postfix = '/app';
const CREATE_UNIT = `CREATE_UNIT${postfix}`;
const CREATE_UNIT_SUCCESS = `CREATE_UNIT_SUCCESS${postfix}`;
const CREATE_UNIT_ERROR = `CREATE_UNIT_ERROR${postfix}`;

export const createUnitAction: ActionFunctionAny<Action<any>> = createAction(
  CREATE_UNIT
);
export const createUnitSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_UNIT_SUCCESS);
export const createUnitErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_UNIT_ERROR);

function* createUnitWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history } = action.payload;
    const result = yield call(createUnit, fields);
    yield put(createUnitSuccessAction(result));
    yield history.push('/units');
    yield put(loadUnitsAction());
    yield put(
      notificationAction({
        message: `¡Unidad ${result.returnCode} ha sido creada!`,
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
    yield put(createUnitErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* createUnitWatcher(): Generator<any, any, any> {
  yield takeLatest(CREATE_UNIT, createUnitWorker);
}

const unitReducerHandlers = {
  [CREATE_UNIT]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [CREATE_UNIT_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      unit: null,
    };
  },
  [CREATE_UNIT_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(createUnitWatcher);
unitsReducer.addHandlers(unitReducerHandlers);
