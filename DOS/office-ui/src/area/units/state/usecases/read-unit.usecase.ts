import { Action, createAction, ActionFunctionAny } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { mergeSaga } from 'src/redux-utils/merge-saga';
import { readUnit } from '../../service/unit.service';
import { unitsReducer } from '../units.reducer';

const postfix = '/app';
const READ_UNIT = `READ_UNIT${postfix}`;
const READ_UNIT_SUCCESS = `READ_UNIT_SUCCESS${postfix}`;
const READ_UNIT_ERROR = `READ_UNIT_ERROR${postfix}`;

export const readUnitAction: ActionFunctionAny<Action<any>> = createAction(
  READ_UNIT
);
export const readUnitSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(READ_UNIT_SUCCESS);
export const readUnitErrorAction: ActionFunctionAny<Action<any>> = createAction(
  READ_UNIT_ERROR
);

function* readUnitWorker(action: any): Generator<any, any, any> {
  try {
    const { id } = action.payload;
    const result = yield call(readUnit, id);
    yield put(readUnitSuccessAction(result));
  } catch (e) {
    const { history } = action.payload;
    yield history.push('/units/list');
    yield put(readUnitErrorAction());
  }
}

function* readUnitWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_UNIT, readUnitWorker);
}

const unitsReducerHandlers = {
  [READ_UNIT]: (state: any) => {
    return {
      ...state,
      loading: true,
      unit: null,
    };
  },
  [READ_UNIT_SUCCESS]: (state: any, action: any) => {
    return {
      ...state,
      loading: false,
      unit: action.payload.unit,
    };
  },
  [READ_UNIT_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(readUnitWatcher);
unitsReducer.addHandlers(unitsReducerHandlers);
