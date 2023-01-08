// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import PDFDocument from "pdfkit";
type Data = {
  name: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const doc = new PDFDocument();
  console.log(req.body);
  doc.pipe(res);
  doc.addPage().fontSize(25).text("Here is some vector graphics...", 100, 100);
  doc.save().moveTo(100, 150).lineTo(100, 250).lineTo(200, 250).fill("#FF3300");
  doc.scale(0.6).translate(470, -380).path("M 250,75 L 323,301 131,161 369,161 177,301 z").fill("red", "even-odd").restore();
  doc.addPage().fillColor("blue").text("Here is a link!", 100, 100).underline(100, 100, 160, 27, { color: "#0000FF" }).link(100, 100, 160, 27, "http://google.com/");

  // Finalize PDF file
  doc.end();
}
