import { createSelector } from 'reselect';
import { unitsReducer, Unit, UnitSlice } from './units.reducer';

const sliceSelector = (state: any) => state[unitsReducer.sliceName];

export const unitsSelector = createSelector(
  sliceSelector,
  (slice: UnitSlice) => slice.units
);

export const unitSelector = createSelector(
  sliceSelector,
  (slice: UnitSlice): Unit | null => slice.unit,
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: UnitSlice) => slice.loading
);

export const unitsCatalogSelector = createSelector(
  sliceSelector,
  (slice: UnitSlice) =>
    slice.units &&
    Array.isArray(slice.units) &&
    slice.units.map((unit: Unit) => {
      return {
        ...unit,
      };
    })
);

export const pagingSelector = createSelector(
  sliceSelector,
  (slice: UnitSlice) => slice.paging
);

export const filtersSelector = createSelector(
  sliceSelector,
  (slice: UnitSlice) => slice.filters
);
