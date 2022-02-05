import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { readVoucher } from "../../service/voucher.service";
import { vouchersReducer } from "../vouchers.reducer";
import { vouchersOutIdsSelector } from "../vouchers.selectors";

const postfix = "/app";
const READ_VOUCHER_OUT = `READ_VOUCHER_OUT${postfix}`;
const READ_VOUCHER_OUT_SUCCESS = `READ_VOUCHER_OUT_SUCCESS${postfix}`;
const READ_VOUCHER_OUT_ERROR = `READ_VOUCHER_OUT_ERROR${postfix}`;

export const readVoucherOutAction: ActionFunctionAny<Action<any>> =
  createAction(READ_VOUCHER_OUT);
export const readVoucherOutSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(READ_VOUCHER_OUT_SUCCESS);
export const readVoucherOutErrorAction: ActionFunctionAny<Action<any>> =
  createAction(READ_VOUCHER_OUT_ERROR);

function* readVoucherOutWorker(action: any): Generator<any, any, any> {
  try {
    const { selected } = action.payload;
    const ids = yield select(vouchersOutIdsSelector);
    const diff1 = selected.filter(x => !ids.includes(x.toString()));
    const diff2 = ids.filter(y => !selected.includes(parseInt(y, 10)));
    const idToRemove = diff2[diff2.length - 1];
    const result = diff1.length ? yield call(readVoucher, diff1[diff1.length - 1]) : null;
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(
      readVoucherOutSuccessAction({ ...result, idToRemove })
    );
  } catch (e: any) {
    // const { history } = action.payload;
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );
      console.log(e);
    // yield history.push("/vouchers/list");
    yield put(readVoucherOutErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
  }
}

function* readVoucherOutWatcher(): Generator<any, any, any> {
  yield takeLatest(READ_VOUCHER_OUT, readVoucherOutWorker);
}

const vouchersReducerHandlers = {
  [READ_VOUCHER_OUT]: (state: any) => {
    return {
      ...state,
      loading: true,
    };
  },
  [READ_VOUCHER_OUT_SUCCESS]: (state: any, action: any) => {
    const {idToRemove, voucher} = action.payload;
    if (idToRemove) {
      delete state.vouchersOut[idToRemove];
    }
    return {
      ...state,
      loading: false,
      vouchersOut: {
        ...state.vouchersOut,
        ...(voucher ? {[voucher.id]: voucher} : {}),
      },
    };
  },
  [READ_VOUCHER_OUT_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(readVoucherOutWatcher);
vouchersReducer.addHandlers(vouchersReducerHandlers);
