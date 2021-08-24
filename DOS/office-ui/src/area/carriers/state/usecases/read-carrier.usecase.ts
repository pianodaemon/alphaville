import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { readCarrier } from '../../service/carrier.service';
import { carriersReducer } from '../carriers.reducer';

const postfix = '/app';
const READ_CARRIER = `READ_CARRIER${postfix}`;
const READ_CARRIER_SUCCESS = `READ_CARRIER_SUCCESS${postfix}`;
const READ_CARRIER_ERROR = `READ_CARRIER_ERROR${postfix}`;

export const readCarrierAction: ActionFunctionAny<Action<any>> = createAction(
  READ_CARRIER
);
export const readCarrierSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_CARRIER_SUCCESS);
export const readCarrierErrorAction: ActionFunctionAny<Action<any>> = createAction(
  READ_CARRIER_ERROR
);

function* readCarrierWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readCarrier, id);
    yield put(readCarrierSuccessAction(result));
  } catch (e) {
    const { history } = action.payload;
    yield history.push('/carriers/list');
    yield put(readCarrierErrorAction());
  }
}

function* readCarrierWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_CARRIER, readCarrierWorker);
}

const carriersReducerHandlers = {
  [READ_CARRIER]: (state: any) => {
    return {
      ...state,
      loading: true,
      carrier: null,
    };
  },
  [READ_CARRIER_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      carrier: action.payload.carrier,
    };
  },
  [READ_CARRIER_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(readCarrierWatcher);
carriersReducer.addHandlers(carriersReducerHandlers);
