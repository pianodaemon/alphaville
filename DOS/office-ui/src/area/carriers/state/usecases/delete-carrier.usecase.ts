import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { notificationAction } from 'src/area/main/state/usecase/notification.usecase';
import { deleteCarrier } from '../../service/carrier.service';
import { carriersReducer } from '../carriers.reducer';
import { loadCarriersAction } from './load-carriers.usecase';

const postfix = '/app';
const DELETE_CARRIER = `DELETE_CARRIER${postfix}`;
const DELETE_CARRIER_SUCCESS = `DELETE_CARRIER_SUCCESS${postfix}`;
const DELETE_CARRIER_ERROR = `DELETE_CARRIER_ERROR${postfix}`;

export const deleteCarrierAction: ActionFunctionAny<Action<any>> = createAction(
  DELETE_CARRIER
);
export const deleteCarrierSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(DELETE_CARRIER_SUCCESS);
export const deleteCarrierErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(DELETE_CARRIER_ERROR);

function* deleteCarrierWorker(action: any): Generator<any, any, any> {
  try {
    const result = yield call(deleteCarrier, action.payload);
    yield put(deleteCarrierSuccessAction(result));
    yield put(loadCarriersAction());
    yield put(
      notificationAction({
        message: `¡Carrier ${action.payload} ha sido eliminada!`,
      }),
    );
  } catch (e) {
    const message =
      e.response && e.response.data && e.response.data.message
        ? e.response.data.message
        : '¡Error de inesperado! Por favor contacte al Administrador.';
    yield put(deleteCarrierErrorAction());
    yield put(
      notificationAction({
        message,
        type: 'error',
      }),
    );
    yield console.log(e);
  }
}

function* deleteCarrierWatcher(): Generator<any, any, any> {
  yield takeLatest(DELETE_CARRIER, deleteCarrierWorker);
}

const carriersReducerHandlers = {
  [DELETE_CARRIER]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [DELETE_CARRIER_SUCCESS]: (state: any) => {
    return {
      ...state,
      loading: false,
    };
  },
  [DELETE_CARRIER_ERROR]: (state: any) => {
    return {
      ...state,
      error: true,
      loading: false,
    };
  },
};

mergeSaga(deleteCarrierWatcher);
carriersReducer.addHandlers(carriersReducerHandlers);
