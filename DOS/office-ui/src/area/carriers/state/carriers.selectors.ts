import { createSelector } from 'reselect';
import { carriersReducer, Carrier, CarrierSlice } from './carriers.reducer';

const sliceSelector = (state: any) => state[carriersReducer.sliceName];

export const carriersSelector = createSelector(
  sliceSelector,
  (slice: CarrierSlice) => slice.carriers
);

export const carrierSelector = createSelector(
  sliceSelector,
  (slice: CarrierSlice): Carrier | null => slice.carrier,
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: CarrierSlice) => slice.loading
);

export const carriersCatalogSelector = createSelector(
  sliceSelector,
  (slice: CarrierSlice) =>
    slice.carriers &&
    Array.isArray(slice.carriers) &&
    slice.carriers.map((carrier: Carrier) => {
      return {
        ...carrier,
        disabled: carrier.disabled ? 'No' : 'Sí',
      };
    })
);

export const catalogSelector = createSelector(
  sliceSelector,
  (slice: CarrierSlice): Carrier[] | null => slice.carriersCatalog,
);

export const pagingSelector = createSelector(
  sliceSelector,
  (slice: CarrierSlice) => slice.paging
);

export const filtersSelector = createSelector(
  sliceSelector,
  (slice: CarrierSlice) => slice.filters
);
