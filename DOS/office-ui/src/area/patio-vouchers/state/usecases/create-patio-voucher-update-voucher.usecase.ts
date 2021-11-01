import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { put, take, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { resolveError } from "src/shared/utils/resolve-error.util";
import {
  updateVoucherAction,
  updateVoucherErrorAction,
  updateVoucherSuccessAction,
} from "src/area/vouchers/state/usecases/update-voucher.usecate";
import { patioVouchersReducer } from "../patio-vouchers.reducer";
// import { loadPatioVouchersAction } from "./load-patio-vouchers.usecase";
import {
  createPatioVoucherAction,
  createPatioVoucherErrorAction,
  createPatioVoucherSuccessAction,
} from "./create-patio-voucher.usecase";

const postfix = "/app";
const CREATE_PATIO_VOUCHER_UPDATE_VOUCHER = `CREATE_PATIO_VOUCHER_UPDATE_VOUCHER${postfix}`;
const CREATE_PATIO_VOUCHER_UPDATE_VOUCHER_SUCCESS = `CREATE_PATIO_VOUCHER_UPDATE_VOUCHER_SUCCESS${postfix}`;
const CREATE_PATIO_VOUCHER_UPDATE_VOUCHER_ERROR = `CREATE_PATIO_VOUCHER_UPDATE_VOUCHER_ERROR${postfix}`;

export const createPatioVoucherUpdateVoucherAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_PATIO_VOUCHER_UPDATE_VOUCHER);
export const createPatioVoucherUpdateVoucherSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_PATIO_VOUCHER_UPDATE_VOUCHER_SUCCESS);
export const createPatioVoucherUpdateVoucherErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_PATIO_VOUCHER_UPDATE_VOUCHER_ERROR);

function* createPatioVoucherWorker(action: any): Generator<any, any, any> {
  try {
    const { create, history, id, update } = action.payload;
    yield put(createPatioVoucherAction({ fields: create }));
    yield take([
      createPatioVoucherSuccessAction,
      createPatioVoucherErrorAction,
    ]);
    yield put(updateVoucherAction({ fields: update, id }));
    yield take([updateVoucherErrorAction, updateVoucherSuccessAction]);
    if (history) {
      yield history.push("/vouchers");
    }
    /*
    yield put(loadPatioVouchersAction());
    yield put(
      notificationAction({
        message: `¡Vale para equipo dejado en patio ${result.returnCode} ha sido creado!`,
        type: "success",
      })
    );
    */
  } catch (e: any) {
    // const { releaseForm } = action.payload;
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );

    // yield releaseForm();
    yield put(createPatioVoucherErrorAction(action.payload));
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
    yield console.log(e);
  }
}

function* createPatioVoucherWatcher(): Generator<any, any, any> {
  yield takeLatest(
    CREATE_PATIO_VOUCHER_UPDATE_VOUCHER,
    createPatioVoucherWorker
  );
}

const patioVoucherReducerHandlers = {
  [CREATE_PATIO_VOUCHER_UPDATE_VOUCHER]: (state: any) => {
    return {
      ...state,
    };
  },
  [CREATE_PATIO_VOUCHER_UPDATE_VOUCHER_SUCCESS]: (state: any) => {
    return {
      ...state,
    };
  },
  [CREATE_PATIO_VOUCHER_UPDATE_VOUCHER_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      error: true,
    };
  },
};

mergeSaga(createPatioVoucherWatcher);
patioVouchersReducer.addHandlers(patioVoucherReducerHandlers);
