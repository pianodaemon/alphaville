import { createSelector } from "reselect";
import { incidencesReducer, Incidence, IncidenceSlice } from "./incidences.reducer";
import { userCatalogSelector } from "src/area/users/state/users.selectors";
import { catalogSelector } from "src/area/equipments/state/equipments.selectors";
import { statusesSelector } from "src/area/statuses/state/statuses.selectors";
import { Statuses } from "src/shared/constants/voucher-statuses.constants";

const sliceSelector = (state: IncidenceSlice) => state[incidencesReducer.sliceName];

export const incidencessSelector = createSelector(
  sliceSelector,
  (slice: IncidenceSlice) => slice.incidences
);

export const incidenceSelector = createSelector(
  sliceSelector,
  catalogSelector,
  (slice: IncidenceSlice, equipments): any => {
    const { incidence } = slice;
    return {
      ...incidence,
      itemList: equipments?.map((equipment) => {
        const quantity =
        incidence?.itemList?.find((equip) => {
            return equip.equipmentCode === equipment.code;
          })?.quantity || 0;
        const { code, regular, unitCost, title } = equipment;
        const canEditUnit = () => {
          switch (true) {
            case incidence &&
            incidence.status === Statuses.ENTRADA &&
              parseInt(quantity.toString(), 10) > 0:
              return true;
            case incidence &&
              [Statuses.ENTRADA, Statuses.CARRETERA].indexOf(incidence.status) >
                -1 &&
              parseInt(quantity.toString(), 10) === 0:
              return false;
            default:
              return true;
          }
        };
        return {
          quantity,
          equipmentCode: code,
          regular,
          unitCost,
          title,
          canEdit: canEditUnit(),
          maxQuantity: quantity,
        };
      }),
    };
  }
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: IncidenceSlice) => slice.loading
);

export const incidencesCatalogSelector = createSelector(
  sliceSelector,
  userCatalogSelector,
  statusesSelector,
  (slice: IncidenceSlice, users, statuses) =>
    slice.incidences &&
    users &&
    Array.isArray(users) &&
    Array.isArray(slice.incidences) &&
    slice.incidences.map((incidence: Incidence) => {
      return {
        ...incidence,
        status:
          (statuses &&
            statuses.find((status) => status.code === incidence.status)?.title) ||
          "",
        stat: incidence.status,
      };
    })
);

export const pagingSelector = createSelector(
  sliceSelector,
  (slice: IncidenceSlice) => slice.paging
);

export const filtersSelector = createSelector(
  sliceSelector,
  (slice: IncidenceSlice) => slice.filters
);

export const searchSelector = createSelector(
  sliceSelector,
  (slice: IncidenceSlice): Incidence | null =>
    slice.search ? slice.search.incidence : null
);

export const searchLoadingSelector = createSelector(
  sliceSelector,
  (slice: IncidenceSlice): boolean | undefined => slice.search?.loading
);
