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
import { incidencesReducer } from "../incidences.reducer";
// import { loadPatioVouchersAction } from "./load-patio-vouchers.usecase";
import {
  createIncidenceAction,
  createIncidenceErrorAction,
  createIncidenceSuccessAction,
} from "./create-incidence.usecase";

const postfix = "/app";
const CREATE_INCIDENCE_UPDATE_VOUCHER = `CREATE_INCIDENCE_UPDATE_VOUCHER${postfix}`;
const CREATE_INCIDENCE_UPDATE_VOUCHER_SUCCESS = `CREATE_INCIDENCE_UPDATE_VOUCHER_SUCCESS${postfix}`;
const CREATE_INCIDENCE_UPDATE_VOUCHER_ERROR = `CREATE_INCIDENCE_UPDATE_VOUCHER_ERROR${postfix}`;

export const createIncidenceUpdateVoucherAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_INCIDENCE_UPDATE_VOUCHER);
export const createIncidenceUpdateVoucherSuccessAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_INCIDENCE_UPDATE_VOUCHER_SUCCESS);
export const createIncidenceUpdateVoucherErrorAction: ActionFunctionAny<
  Action<any>
> = createAction(CREATE_INCIDENCE_UPDATE_VOUCHER_ERROR);

function* createIncidenceUpdateVoucherWorker(action: any): Generator<any, any, any> {
  try {
    const { create, history, id, update } = action.payload;
    yield put(createIncidenceAction({ fields: create }));
    yield take([
      createIncidenceSuccessAction,
      createIncidenceErrorAction,
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
    yield put(createIncidenceUpdateVoucherErrorAction(action.payload));
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
    yield console.log(e);
  }
}

function* createIncidenceUpdateVoucherWatcher(): Generator<any, any, any> {
  yield takeLatest(
    CREATE_INCIDENCE_UPDATE_VOUCHER,
    createIncidenceUpdateVoucherWorker
  );
}

const incidenceReducerHandlers = {
  [CREATE_INCIDENCE_UPDATE_VOUCHER]: (state: any) => {
    return {
      ...state,
    };
  },
  [CREATE_INCIDENCE_UPDATE_VOUCHER_SUCCESS]: (state: any) => {
    return {
      ...state,
    };
  },
  [CREATE_INCIDENCE_UPDATE_VOUCHER_ERROR]: (state: any, action: any) => {
    return {
      ...state,
      error: true,
    };
  },
};

mergeSaga(createIncidenceUpdateVoucherWatcher);
incidencesReducer.addHandlers(incidenceReducerHandlers);
