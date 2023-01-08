// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import PDFDocument from "pdfkit-table";
type Data = {
  name: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const doc = new PDFDocument();
  const data = JSON.parse(req.body);
  doc.pipe(res);
  const hasImage = data.fields.logo !== undefined;

  doc
    .fontSize(20)
    .font("Helvetica")
    .fillColor("#aaaaaa")
    .text("INVOICE", (doc.page.width - 100) / 2, 40, { align: "center", width: 100 })
    .fillColor("#000000");
  if (hasImage) {
    doc.image(data.fields.logo, 70, 90, { width: 70 });
  }

  doc
    .font("Times-Bold")
    .fontSize(12)
    .text(data.fields.name, 70 + (hasImage ? 80 : 0), 89);

  if (data.fields.userAddress) {
    doc
      .font("Times-Roman")
      .fontSize(11)
      .text(data.fields.userAddress, 70 + (hasImage ? 80 : 0), 110, { width: 120 });
  }
  if (data.fields.number) {
    doc.text("Invoice #" + data.fields.number, doc.page.width - 120 - 70, 90, { width: 120, align: "center" });
  }
  const date = new Date();
  date.setUTCFullYear(data.fields.date.split("-")[0], parseInt(data.fields.date.split("-")[1]) - 1, data.fields.date.split("-")[2]);
  doc.text(date.toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" }), doc.page.width - 120 - 70, data.fields.number ? 110 : 90, { width: 120, align: "center" });

  if (data.fields.destAddress) {
    doc.text("To: " + data.fields.destAddress, 70 + (hasImage ? 80 : 0), 160, { width: 120 });
  }
  (async function () {
    // table
    const table = {
      headers: ["Description", "Amount"],
      rows: data.itemRows
        .map((row: { name: string; price: string }) => {
          return [row.name, "$" + row.price];
        })
        .concat(Array(100 - data.itemRows.length).fill(["", ""]))
        .concat([["Total", "$1000"]]),
    };
    // A4 595.28 x 841.89 (portrait) (about width sizes)
    // width
    await doc.table(table, {
      x: 70,
      y: data.fields.destAddress ? 310 : 260,
      columnsSize: [doc.page.width - 240, 100],
    });
    // or columnsSize
    // done!
    doc.end();
  })();
}
