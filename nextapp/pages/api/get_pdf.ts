// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import PDFDocument from "pdfkit-table";
import type PDFDocumentWithTables from "pdfkit-table";
type Data = {
  name: string;
};
interface ItemRow {
  name: string;
  price: string;
}

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
    .text(data.fields.name, 70 + (hasImage ? 80 : 0), 89)
    .font("Times-Roman");

  if (data.fields.userAddress) {
    doc
      .font("Times-Roman")
      .fontSize(11)
      .text(data.fields.userAddress, 70 + (hasImage ? 80 : 0), 110, { width: 140 });
  }
  if (data.fields.phone) {
    doc.text(data.fields.phone, 70 + (hasImage ? 80 : 0), undefined, { width: 140 });
  }
  if (data.fields.number) {
    doc.text("Invoice #" + data.fields.number, doc.page.width - 120 - 70, 90, { width: 120, align: "center" });
  }
  const date = new Date();
  date.setUTCFullYear(data.fields.date.split("-")[0], parseInt(data.fields.date.split("-")[1]) - 1, data.fields.date.split("-")[2]);
  doc.text(date.toLocaleDateString("en", { month: "long", day: "numeric", year: "numeric" }), doc.page.width - 120 - 70, data.fields.number ? 110 : 90, { width: 120, align: "center" });

  if (data.fields.destName || data.fields.destAddress) {
    doc.text("To: ", 70 + (hasImage ? 80 : 0), 165, { width: 140 });
  }
  if (data.fields.destName) {
    doc.text(data.fields.destName, 70 + (hasImage ? 80 : 0), undefined, { width: 140 });
  }
  if (data.fields.destAddress) {
    doc.text(data.fields.destAddress, 70 + (hasImage ? 80 : 0), undefined, { width: 140 });
  }
  (async function () {
    // table
    const table = {
      headers: [
        {
          label: "   Description",
          property: "name",
          renderer: (value: string) => value,
          width: doc.page.width - 240,
        },
        {
          label: "   Amount",
          property: "price",
          renderer: (value: string) => value,
          width: 100,
        },
      ],

      datas: data.itemRows
        .map((row: ItemRow, i: number) => ({
          name: "   " + (row.name === undefined ? "" : row.name),
          price: "   " + (isNaN(parseFloat(row.price)) ? (row.price === undefined ? "" : row.price) : "$" + row.price),
        }))
        .concat([
          { name: "", price: "" },
          {
            name: "bold:   Total",
            price:
              "bold:   $" +
              data.itemRows.reduce((a: number, b: ItemRow) => {
                if (!isNaN(parseFloat(b.price))) {
                  return a + parseFloat(b.price);
                } else {
                  return a;
                }
              }, 0),
            options: {
              separation: false,
            },
          },
        ]),
    };
    if (data.itemRows.length < 15) {
      table.datas[table.datas.length - 2].price += Array(Math.max(1200 - 60 * data.itemRows.length, 0)) //hack to increase padding of last row
        .fill(" ")
        .join("");
    } else {
      table.datas.splice(table.datas.length - 2, 1);
    }
    table.datas[table.datas.length - 2].options = { separation: true, padding: [0, 0, 0, 100] }; //property can't exist on other rows

    const options = {
      x: 70,
      y: data.fields.destAddress ? 250 : 200,
      columnsSize: [doc.page.width - 240, 100],
    } as any;

    await doc.table(table, options);

    const startX = doc.x;
    const startY = doc.y;
    if (data.itemRows.length < 25) {
      //if its longer then it will go to the next page and the lines wont look nice.
      doc
        .lineWidth(0.5)
        .moveTo(startX, startY - 10)
        .lineTo(startX, (data.fields.destAddress ? 250 : 200) - 4)
        .lineTo(doc.page.width - 70, (data.fields.destAddress ? 250 : 200) - 4)
        .lineTo(doc.page.width - 70, startY - 10)
        .stroke()
        .moveTo(doc.page.width - 170, startY - 10)
        .lineTo(doc.page.width - 170, (data.fields.destAddress ? 250 : 200) - 4)
        .stroke();
    }
    doc.end();
  })();
}
