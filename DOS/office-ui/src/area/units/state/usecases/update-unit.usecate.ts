import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
// import { translations } from 'src/shared/translations/translations.util';
import { updateUnit } from '../../service/unit.service';
import { unitsReducer } from '../units.reducer';
import { loadUnitsAction } from './load-units.usecase';

const postfix = '/app';
const UPDATE_UNIT = `UPDATE_UNIT${postfix}`;
const UPDATE_UNIT_SUCCESS = `UPDATE_UNIT_SUCCESS${postfix}`;
const UPDATE_UNIT_ERROR = `UPDATE_UNIT_ERROR${postfix}`;

export const updateUnitAction: ActionFunctionAny<Action<any>> = createAction(
  UPDATE_UNIT
);
export const updateUnitSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_UNIT_SUCCESS);
export const updateUnitErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_UNIT_ERROR);

function* updateUnitWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history, id } = action.payload;
    const result = yield call(updateUnit, id, fields);
    yield put(updateUnitSuccessAction(result));
    yield history.push('/units');
    yield put(loadUnitsAction());
    yield put(
      notificationAction({
        message: `¡Unidad ${id} ha sido actualizada!`,
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
    yield put(updateUnitErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* updateUnitWatcher(): Generator<any, any, any> {
  yield takeLatest(UPDATE_UNIT, updateUnitWorker);
}

const unitsReducerHandlers = {
  [UPDATE_UNIT]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [UPDATE_UNIT_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      unit: null,
    };
  },
  [UPDATE_UNIT_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(updateUnitWatcher);
unitsReducer.addHandlers(unitsReducerHandlers);
