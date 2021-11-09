import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import PDFObject from "pdfobject";
import { getFormattedDate } from "src/shared/utils/format-date.util";
import { Voucher } from "../state/vouchers.reducer";

type Props = {
  voucher: Voucher;
  mountPreviewSelector: string;
};

const A4_PAPER_WIDTH = 210;
const A4_PAPER_HEIGHT = 297;
const PDFObjectOptions = {
  pdfOpenParams: {
    // navpanes: 0,
    // toolbar: 0,
    // statusbar: 0,
    view: "FitV",
  },
  maxHeight: "1000px",
  height: "2000px",
  forcePDFJS: true,
  // PDFJS_URL: "examples/PDF.js/web/viewer.html"
};
const copies = {
  MATERIALS_DISCLAIMER:
    "* Si el material prestado en este vale no es regresado en un plazo de 48 hrs. se procedera a cobro",
  NOTE: "Nota: Alguien ajeno al depto. de control de equipo no tiene autoridad de pedirles que dejen el equipo en alguna patio",
};
const LOGO_URL = "/images/logo.png";

export const createVoucherPDF = ({ voucher, mountPreviewSelector }: Props) => {
  console.log(voucher.itemList);
  const doc = new jsPDF({ orientation: "portrait", format: "a4" });
  doc.setFontSize(18);
  doc.text("Vales".toUpperCase(), A4_PAPER_WIDTH - 50, 10);
  doc.text("Equipo de Amarre".toUpperCase(), A4_PAPER_WIDTH - 70, 15);
  doc.text("Nº :".toUpperCase(), A4_PAPER_WIDTH - 70, 25);
  doc.text(`${voucher.id}`, A4_PAPER_WIDTH - 58, 25);
  doc.setFontSize(12);
  doc.text(copies.MATERIALS_DISCLAIMER.toUpperCase(), 10, 297 - 40, {
    maxWidth: 120,
  });
  doc.text(copies.NOTE.toUpperCase(), 105, 297 - 20, {
    align: "center",
    maxWidth: 120,
  });
  doc.addImage(LOGO_URL, "PNG", 0, 0, 40, 20);

  autoTable(doc, {
    startY: 30,
    showHead: false,
    head: [{ field: "ID", value: "Value" }],
    body: [
      { field: "Unidad", value: voucher.unitCode },
      { field: "Fecha", value: getFormattedDate(voucher.generationTime) },
    ],
    columnStyles: {
      field: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
    },
    margin: { right: 107 },
  });

  autoTable(doc, {
    startY: 30,
    showHead: false,
    head: [{ field: "ID", value: "Value" }],
    body: [
      { field: "Plataforma", value: voucher.platform },
      { field: "Companía", value: voucher.carrierCode },
      { field: "Patio", value: voucher.patioCode },
    ],
    columnStyles: {
      field: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
    },
    margin: { left: 107 },
  });

  if (voucher && voucher.itemList && voucher.itemList.length > 0) {
    autoTable(doc, {
      startY: 60,
      // showHead: false,
      head: [{ equipment: "", units: "Unidad", cost: "Costo Unit.", }],
      body: [
        ...voucher.itemList.filter((item, index) => index % 2 === 0 ).map((item: any) => ({
          equipment: item.title,
          units: Intl.NumberFormat('es-MX',).format(item.quantity),
          cost: Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.unitCost),
        })),
      ],
      columnStyles: {
        field: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
      },
      margin: { right: 107 },
    });

    autoTable(doc, {
      startY: 60,
      // showHead: false,
      head: [{ equipment: "", units: "Unidad", cost: "Costo Unit.", }],
      body: [
        ...voucher.itemList.filter((item, index) => index % 2 !== 0 ).map((item: any) => ({
          equipment: item.title,
          units: Intl.NumberFormat('es-MX',).format(item.quantity),
          cost: Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.unitCost),
        })),
      ],
      columnStyles: {
        field: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
      },
      margin: { left: 107 },
    });
  }

  autoTable(doc, {
    // startY: (doc as any).lastAutoTable.finalY + 150,
    startY: A4_PAPER_HEIGHT - 120,
    showHead: 'firstPage',
    head: [{ field: "Observaciones",}],
    body: [
      { field: voucher.observations },
    ],
    styles: { overflow: 'linebreak', cellWidth: 'wrap', },
    // tableWidth: 'wrap',
    // Override the default above for the text column
    columnStyles: { text: { cellWidth: 'auto' },},
    pageBreak: 'avoid',
    bodyStyles: { valign: 'top' },
    headStyles: {
      fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold",
    },
  });

  autoTable(doc, {
    startY: A4_PAPER_HEIGHT - 70,
    showHead: false,
    head: [{ field: "ID", value: "Value" }],
    body: [
      { field: "Entregó Equipo", value: voucher.deliveredBy },
      { field: "Recibió Equipo", value: voucher.receivedBy },
      { field: "Operador", value: "" },
    ],
    columnStyles: {
      field: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
    },
    margin: { left: 15 },
  });


  PDFObject.embed(
    doc.output("bloburl") as unknown as string,
    `#${mountPreviewSelector}`,
    PDFObjectOptions
  );
};
