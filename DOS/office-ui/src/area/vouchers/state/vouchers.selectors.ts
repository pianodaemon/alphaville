import { createSelector } from "reselect";
import { vouchersReducer, Voucher, VoucherSlice } from "./vouchers.reducer";
import { userCatalogSelector } from "src/area/users/state/users.selectors";
import { catalogSelector } from "src/area/equipments/state/equipments.selectors";
import { statusesSelector } from "src/area/statuses/state/statuses.selectors";
import { Statuses } from "src/shared/constants/voucher-statuses.constants";
import { catalogSelector as carriersCatalogSelector } from "src/area/carriers/state/carriers.selectors";
import { catalogSelector as patioCatalogSelector } from "src/area/patios/state/patios.selectors";

const sliceSelector = (state: VoucherSlice) => state[vouchersReducer.sliceName];

export const vouchersSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice) => slice.vouchers
);

export const voucherSelector = createSelector(
  sliceSelector,
  catalogSelector,
  (slice: VoucherSlice, equipments): any => {
    const { voucher, editMode } = slice;
    return {
      ...voucher,
      itemList: equipments?.map((equipment) => {
        const quantity =
          voucher?.itemList?.find((equip) => {
            return equip.equipmentCode === equipment.code;
          })?.quantity || 0;
        const { code, regular, unitCost, title } = equipment;
        const canEditUnit = () => {
          switch (true) {
            case voucher &&
              voucher.status === Statuses.ENTRADA &&
              editMode !== "forward" &&
              parseInt(quantity.toString(), 10) > 0:
              return false;
            case voucher &&
              voucher.status === Statuses.ENTRADA &&
              parseInt(quantity.toString(), 10) === 0:
              return true;
            case voucher &&
              [Statuses.ENTRADA, Statuses.CARRETERA].indexOf(voucher.status) >
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

export const voucherPdfSelector = createSelector(
  sliceSelector,
  catalogSelector,
  userCatalogSelector,
  carriersCatalogSelector,
  patioCatalogSelector,
  (slice: VoucherSlice, equipments, users, carriers, patios): any => {
    const { voucher } = slice;
    const deliveredBy =
      voucher &&
      users &&
      users.find((user) => user.username === voucher.deliveredBy);
    const receivedBy =
      voucher &&
      users &&
      users.find((user) => user.username === voucher.receivedBy);
    const carrier =
      voucher &&
      carriers &&
      carriers.find((carr) => carr.code === voucher.carrierCode);
    const patio =
      voucher && patios && patios.find((pat) => pat.code === voucher.patioCode);
    return {
      ...voucher,
      itemList: equipments?.map((equipment) => {
        const quantity =
          voucher?.itemList?.find((equip) => {
            return equip.equipmentCode === equipment.code;
          })?.quantity || 0;
        const { code, regular, unitCost, title } = equipment;
        return {
          quantity,
          equipmentCode: code,
          regular,
          unitCost,
          title,
          maxQuantity: quantity,
        };
      }),
      deliveredBy: deliveredBy
        ? `${deliveredBy.firstName} ${deliveredBy.lastName} (${
            voucher && voucher.deliveredBy
          })`
        : voucher && voucher.deliveredBy,
      receivedBy: receivedBy
        ? `${receivedBy.firstName} ${receivedBy.lastName} (${
            voucher && voucher.receivedBy
          })`
        : voucher && voucher.receivedBy,
      carrierCode: carrier,
      patioCode: patio,
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
  statusesSelector,
  (slice: VoucherSlice, users, statuses) =>
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
        status:
          (statuses &&
            statuses.find((status) => status.code === voucher.status)?.title) ||
          "",
        stat: voucher.status,
      };
    })
);

export const vouchersCatalogIdsSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice) =>
    slice.vouchersCatalog &&
    Array.isArray(slice.vouchersCatalog) &&
    slice.vouchersCatalog.map((voucher: Voucher) => {
      return voucher.id;
    })
);

export const vouchersOutIdsSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice) =>
    slice.vouchersOut ? Object.keys(slice.vouchersOut) : []
);

export const vouchersOutSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice) => Object.values(slice.vouchersOut || {})
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
  (slice: VoucherSlice): Voucher | null =>
    slice.search ? slice.search.voucher : null
);

export const searchLoadingSelector = createSelector(
  sliceSelector,
  (slice: VoucherSlice): boolean | undefined => slice.search?.loading
);
