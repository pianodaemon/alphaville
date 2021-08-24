import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
// import { translations } from 'src/shared/translations/translations.util';
import { updateCarrier } from '../../service/carrier.service';
import { carriersReducer } from '../carriers.reducer';
import { loadCarriersAction } from './load-carriers.usecase';

const postfix = '/app';
const UPDATE_CARRIER = `UPDATE_CARRIER${postfix}`;
const UPDATE_CARRIER_SUCCESS = `UPDATE_CARRIER_SUCCESS${postfix}`;
const UPDATE_CARRIER_ERROR = `UPDATE_CARRIER_ERROR${postfix}`;

export const updateCarrierAction: ActionFunctionAny<Action<any>> = createAction(
  UPDATE_CARRIER
);
export const updateCarrierSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_CARRIER_SUCCESS);
export const updateCarrierErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(UPDATE_CARRIER_ERROR);

function* updateCarrierWorker(action: any): Generator<any, any, any> {
  try {
    const { fields, history, id } = action.payload;
    const result = yield call(updateCarrier, id, fields);
    yield put(updateCarrierSuccessAction(result));
    yield history.push('/carriers');
    yield put(loadCarriersAction());
    yield put(
      notificationAction({
        message: `¡Carrier ${id} ha sido actualizada!`,
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
    yield put(updateCarrierErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      })
    );
    yield console.log(e);
  }
}

function* updateCarrierWatcher(): Generator<any, any, any> {
  yield takeLatest(UPDATE_CARRIER, updateCarrierWorker);
}

const carriersReducerHandlers = {
  [UPDATE_CARRIER]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [UPDATE_CARRIER_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
      carrier: null,
    };
  },
  [UPDATE_CARRIER_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(updateCarrierWatcher);
carriersReducer.addHandlers(carriersReducerHandlers);
