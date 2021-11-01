import { createSelector } from "reselect";
import { patioVouchersReducer, PatioVoucher, PatioVoucherSlice } from "./patio-vouchers.reducer";
import { userCatalogSelector } from "src/area/users/state/users.selectors";
import { catalogSelector } from "src/area/equipments/state/equipments.selectors";
import { statusesSelector } from "src/area/statuses/state/statuses.selectors";
import { Statuses } from "src/shared/constants/voucher-statuses.constants";

const sliceSelector = (state: PatioVoucherSlice) => state[patioVouchersReducer.sliceName];

export const patioVouchersSelector = createSelector(
  sliceSelector,
  (slice: PatioVoucherSlice) => slice.patioVouchers
);

export const patioVoucherSelector = createSelector(
  sliceSelector,
  catalogSelector,
  (slice: PatioVoucherSlice, equipments): any => {
    const { patioVoucher } = slice;
    return {
      ...patioVoucher,
      itemList: equipments?.map((equipment) => {
        const quantity =
        patioVoucher?.itemList?.find((equip) => {
            return equip.equipmentCode === equipment.code;
          })?.quantity || 0;
        const { code, regular, unitCost, title } = equipment;
        const canEditUnit = () => {
          switch (true) {
            case patioVoucher &&
            patioVoucher.status === Statuses.ENTRADA &&
              parseInt(quantity.toString(), 10) > 0:
              return true;
            case patioVoucher &&
              [Statuses.ENTRADA, Statuses.CARRETERA].indexOf(patioVoucher.status) >
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
  (slice: PatioVoucherSlice) => slice.loading
);

export const patioVouchersCatalogSelector = createSelector(
  sliceSelector,
  userCatalogSelector,
  statusesSelector,
  (slice: PatioVoucherSlice, users, statuses) =>
    slice.patioVouchers &&
    users &&
    Array.isArray(users) &&
    Array.isArray(slice.patioVouchers) &&
    slice.patioVouchers.map((voucher: PatioVoucher) => {
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
        status:
          (statuses &&
            statuses.find((status) => status.code === voucher.status)?.title) ||
          "",
        stat: voucher.status,
      };
    })
);

export const pagingSelector = createSelector(
  sliceSelector,
  (slice: PatioVoucherSlice) => slice.paging
);

export const filtersSelector = createSelector(
  sliceSelector,
  (slice: PatioVoucherSlice) => slice.filters
);

export const searchSelector = createSelector(
  sliceSelector,
  (slice: PatioVoucherSlice): PatioVoucher | null =>
    slice.search ? slice.search.patioVoucher : null
);

export const searchLoadingSelector = createSelector(
  sliceSelector,
  (slice: PatioVoucherSlice): boolean | undefined => slice.search?.loading
);
