import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { getEquipments } from "../../service/equipment.service";
import { equipmentsReducer } from "../equipments.reducer";
import { pagingSelector } from "../equipments.selectors";

const postfix = "/app";
const LOAD_EQUIPMENTS = `LOAD_EQUIPMENTS${postfix}`;
const LOAD_EQUIPMENTS_SUCCESS = `LOAD_EQUIPMENTS_SUCCESS${postfix}`;
const LOAD_EQUIPMENTS_ERROR = `LOAD_EQUIPMENTS_ERROR${postfix}`;

export const loadEquipmentsAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_EQUIPMENTS);
export const loadEquipmentsSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_EQUIPMENTS_SUCCESS);
export const loadEquipmentsErrorAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_EQUIPMENTS_ERROR);

function* loadEquipmentsWorker(action?: any): Generator<any, any, any> {
  try {
    const aliases = { id: "id" };
    const { per_page, page, order, order_by, filters } = action.payload || {};
    const paging = yield select(pagingSelector);
    const options = {
      ...action.payload,
      per_page: per_page || paging.per_page,
      page: page || paging.page,
      pages: paging.pages,
      order: order || paging.order,
      order_by: aliases[order_by] || aliases[paging.order_by] || "id",
      ...filters,
    };
    delete options.filters;
    const result = yield call(getEquipments, options);
    if (result && result.returnCode === errorCodes.GENERIC_ERROR) {
      throw new Error(result.returnMessage);
    }
    yield put(
      loadEquipmentsSuccessAction({
        equipments: result.data,
        paging: {
          count: parseInt(result.data.totalItems, 10) || 0,
          pages: parseInt(result.data.totalPages, 10) || 0,
          page: page || paging.page,
          per_page: per_page || paging.per_page,
          order: order || paging.order,
          order_by: order_by || paging.order_by,
        },
        filters,
      })
    );
  } catch (e: any) {
    const message: string = resolveError(
      e.response?.data?.message || e.message
    );
    yield put(loadEquipmentsErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
  }
}

function* loadEquipmentsWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_EQUIPMENTS, loadEquipmentsWorker);
}

const equipmentsReducerHandlers = {
  [LOAD_EQUIPMENTS]: (state: any, action) => {
    const { payload } = action || {};
    const { filters } = payload || {};
    return {
      ...state,
      loading: true,
      filters: filters || {},
      equipment: null,
    };
  },
  [LOAD_EQUIPMENTS_SUCCESS]: (state: any, action: any) => {
    const { equipments, paging, filters } = action.payload;
    return {
      ...state,
      loading: false,
      equipments: equipments.equipmentList,
      paging: {
        ...paging,
      },
      filters,
    };
  },
  [LOAD_EQUIPMENTS_ERROR]: (state: any) => {
    return {
      ...state,
      loading: false,
      error: true,
    };
  },
};

mergeSaga(loadEquipmentsWatcher);
equipmentsReducer.addHandlers(equipmentsReducerHandlers);
