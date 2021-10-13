import { createSelector } from "reselect";
import { vouchersReducer, Voucher, VoucherSlice } from "./vouchers.reducer";
import { userCatalogSelector } from "src/area/users/state/users.selectors";
import { catalogSelector } from "src/area/equipments/state/equipments.selectors";

const sliceSelector = (state: VoucherSlice) => state[vouchersReducer.sliceName];

export const vouchersSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice) => slice.vouchers
);

export const voucherSelector = createSelector(
  sliceSelector,
  catalogSelector,
  (slice: VoucherSlice, equipments): any => {
    const { voucher } = slice;
    return {
      ...voucher,
      itemList: equipments?.map((equipment) => {
        const quantity = voucher?.itemList?.find((equip) => {
          return equip.equipmentCode === equipment.code;
        })?.quantity || 0;
        const { code, regular, unitCost, title } = equipment;
        return {
          quantity,
          equipmentCode: code,
          regular,
          unitCost,
          title,
        };
      }),
    };
  }
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


export const searchSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice): Voucher | null => slice.search ? slice.search.voucher : null
);

export const searchLoadingSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice): boolean | undefined => slice.search?.loading
);
