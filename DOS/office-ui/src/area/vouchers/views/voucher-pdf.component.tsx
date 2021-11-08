import { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { createVoucherPDF } from "../utils/create-voucher-pdf.util";
import { Voucher } from "../state/vouchers.reducer";

type Props = {
  loadUsersAsCatalogAction: Function;
  loadEquipmentsCatalogAction: Function;
  loadCarriersCatalogAction: Function;
  loadPatiosCatalogAction: Function;
  loadUnitsCatalogAction: Function;
  readVoucherAction: Function;
  voucher: Voucher;
};

const mountPreviewSelector = "preview";

export const VoucherPdf = (props: Props) => {
  const {
    loadUsersAsCatalogAction,
    loadEquipmentsCatalogAction,
    loadCarriersCatalogAction,
    loadPatiosCatalogAction,
    loadUnitsCatalogAction,
    readVoucherAction,
    voucher,
  } = props;
  const { id } = useParams<any>();
  const history = useHistory();
  const options = { per_page: Number.MAX_SAFE_INTEGER };

  useEffect(() => {
    loadUsersAsCatalogAction(options);
    loadEquipmentsCatalogAction(options);
    loadCarriersCatalogAction(options);
    loadPatiosCatalogAction(options);
    loadUnitsCatalogAction(options);
    readVoucherAction({ id, history });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (voucher.id) {
      createVoucherPDF({ voucher: {...voucher}, mountPreviewSelector });
    }
  }, [voucher]);

  return <div id={mountPreviewSelector}></div>;
};
