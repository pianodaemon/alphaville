import { createSelector } from "reselect";
import { vouchersReducer, Voucher, VoucherSlice } from "./vouchers.reducer";
import { userCatalogSelector } from "src/area/users/state/users.selectors";

const sliceSelector = (state: VoucherSlice) => state[vouchersReducer.sliceName];

export const vouchersSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice) => slice.vouchers
);

export const voucherSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice): Voucher | null => slice.voucher
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
  userCatalogSelector,
  (slice: VoucherSlice, users) =>
    slice.vouchers &&
    users &&
    Array.isArray(users) &&
    Array.isArray(slice.vouchers) &&
    slice.vouchers.map((voucher: Voucher) => {
      const deliveredBy = users.find(
        (user) => user.username === voucher.deliveredBy
      );
      const receivedBy = users.find(
        (user) => user.username === voucher.receivedBy
      );
      return {
        ...voucher,
        deliveredBy: deliveredBy
          ? `${deliveredBy.firstName} ${deliveredBy.lastName} (${voucher.deliveredBy})`
          : voucher.deliveredBy,
        receivedBy: receivedBy
          ? `${receivedBy.firstName} ${receivedBy.lastName} (${voucher.receivedBy})`
          : voucher.receivedBy,
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
