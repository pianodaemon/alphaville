import { createSelector } from 'reselect';
import { vouchersReducer, Voucher, VoucherSlice } from './vouchers.reducer';

const sliceSelector = (state: VoucherSlice) => state[vouchersReducer.sliceName];

export const vouchersSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice) => slice.vouchers
);

export const voucherSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice): Voucher | null => slice.voucher,
);

export const isLoadingSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice) => slice.loading
);
/*
export const catalogSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice) => slice.catalog
);
*/
export const vouchersCatalogSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice) =>
    slice.vouchers &&
    Array.isArray(slice.vouchers) &&
    slice.vouchers.map((voucher: Voucher) => {
      return {
        ...voucher,
      };
    })
);

export const pagingSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice) => slice.paging
);

export const filtersSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice) => slice.filters
);
