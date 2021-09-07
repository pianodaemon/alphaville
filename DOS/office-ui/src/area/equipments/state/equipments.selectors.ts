import { createSelector } from 'reselect';
import { equipmentsReducer, Equipment, EquipmentSlice } from './equipments.reducer';

const sliceSelector = (state: any) => state[equipmentsReducer.sliceName];

export const equipmentsSelector = createSelector(
  sliceSelector,
  (slice: EquipmentSlice) => slice.equipments
);

export const equipmentSelector = createSelector(
  sliceSelector,
  (slice: EquipmentSlice): Equipment | null => slice.equipment,
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: EquipmentSlice) => slice.loading
);

export const equipmentsCatalogSelector = createSelector(
  sliceSelector,
  (slice: EquipmentSlice) =>
    slice.equipments &&
    Array.isArray(slice.equipments) &&
    slice.equipments.map((equipment: Equipment) => {
      return {
        ...equipment,
        regular_str: equipment.regular ? 'Sí' : 'No',
      };
    })
);

export const catalogSelector = createSelector(
  sliceSelector,
  (slice: EquipmentSlice) => slice.equipmentCatalog
);

export const pagingSelector = createSelector(
  sliceSelector,
  (slice: EquipmentSlice) => slice.paging
);

export const filtersSelector = createSelector(
  sliceSelector,
  (slice: EquipmentSlice) => slice.filters
);
