import { Action, createAction, ActionFunctionAny } from "redux-actions";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { mergeSaga } from "src/redux-utils/merge-saga";
import { errorCodes, resolveError } from "src/shared/utils/resolve-error.util";
import { notificationAction } from "src/area/main/state/usecase/notification.usecase";
import { getEquipments } from "../../service/equipment.service";
import { equipmentsReducer } from "../equipments.reducer";
import { pagingSelector } from "../equipments.selectors";

const postfix = "/app";
const LOAD_EQUIPMENTS_CATALOG = `LOAD_EQUIPMENTS_CATALOG${postfix}`;
const LOAD_EQUIPMENTS_CATALOG_SUCCESS = `LOAD_EQUIPMENTS_CATALOG_SUCCESS${postfix}`;
const LOAD_EQUIPMENTS_CATALOG_ERROR = `LOAD_EQUIPMENTS_CATALOG_ERROR${postfix}`;

export const loadEquipmentsCatalogAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_EQUIPMENTS_CATALOG);
export const loadEquipmentsCatalogSuccessAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_EQUIPMENTS_CATALOG_SUCCESS);
export const loadEquipmentsCatalogErrorAction: ActionFunctionAny<Action<any>> =
  createAction(LOAD_EQUIPMENTS_CATALOG_ERROR);

function* loadEquipmentsCatalogWorker(action?: any): Generator<any, any, any> {
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
      loadEquipmentsCatalogSuccessAction({
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
    yield put(loadEquipmentsCatalogErrorAction());
    yield put(
      notificationAction({
        message,
        type: "error",
      })
    );
  }
}

function* loadEquipmentsWatcher(): Generator<any, any, any> {
  yield takeLatest(LOAD_EQUIPMENTS_CATALOG, loadEquipmentsCatalogWorker);
}

const equipmentsReducerHandlers = {
  [LOAD_EQUIPMENTS_CATALOG]: (state: any, action) => {
    // const { payload } = action || {};
    // const { filters } = payload || {};
    return {
      ...state,
      // loading: true,
      // filters: filters || {},
      equipmentCatalog: null,
    };
  },
  [LOAD_EQUIPMENTS_CATALOG_SUCCESS]: (state: any, action: any) => {
    const { equipments, /* paging, filters */ } = action.payload;
    return {
      ...state,
      // loading: false,
      equipmentCatalog: equipments.equipmentList,
      // paging: { ...paging, },
      // filters,
    };
  },
  [LOAD_EQUIPMENTS_CATALOG_ERROR]: (state: any) => {
    return {
      ...state,
      // loading: false,
      error: true,
    };
  },
};

mergeSaga(loadEquipmentsWatcher);
equipmentsReducer.addHandlers(equipmentsReducerHandlers);
