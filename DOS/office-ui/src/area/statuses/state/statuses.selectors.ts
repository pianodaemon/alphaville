import { createSelector } from "reselect";
import { statusesReducer, Status, StatusSlice } from "./statuses.reducer";

const sliceSelector = (state: StatusSlice) => state[statusesReducer.sliceName];

export const statusesSelector = createSelector(
  sliceSelector,
  (slice: StatusSlice) => slice.statuses
);

export const statusSelector = createSelector(
  sliceSelector,
  (slice: StatusSlice): Status | null => slice.status
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: StatusSlice) => slice.loading
);
/*
export const catalogSelector = createSelector(
  sliceSelector,
  (slice: StatusSlice) => slice.catalog
);
*/
export const statusesCatalogSelector = createSelector(
  sliceSelector,
  (slice: StatusSlice) =>
    slice.statuses &&
    Array.isArray(slice.statuses) &&
    slice.statuses
);

export const pagingSelector = createSelector(
  sliceSelector,
  (slice: StatusSlice) => slice.paging
);

export const filtersSelector = createSelector(
  sliceSelector,
  (slice: StatusSlice) => slice.filters
);
