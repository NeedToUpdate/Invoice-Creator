import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import * as bcrypt from "bcryptjs";
const Cryptr = require("cryptr");
type Data = {
  name?: string;
  data: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method == "GET") {
    const data = req.query as {
      name: string;
      code: string;
    };
    try {
      const client = await clientPromise;
      const db = client.db("invoiceDB");

      const invoice = await db.collection("invoices").findOne({ name: data.name });
      if (invoice) {
        //check password if its correct
        const check = await bcrypt.compare(data.code, invoice.code);
        const cryptr = new Cryptr(data.code);
        if (check) {
          //send back the data
          const decrypted = JSON.parse(cryptr.decrypt(invoice.data));
          return res.status(200).json({
            name: invoice.name,
            data: decrypted,
          });
        }
      }
      return res.status(404).json({ data: "Not Found" });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ data: "Invalid Request" });
    }
  } else if (req.method == "POST") {
    const data = JSON.parse(req.body) as {
      name: string;
      code: string;
      data: object;
    };
    try {
      const client = await clientPromise;
      const db = client.db("invoiceDB");
      //check if this name already exists
      const invoice = await db.collection("invoices").findOne({ name: data.name });
      const cryptr = new Cryptr(data.code);
      if (invoice) {
        //check password if its correct
        const check = await bcrypt.compare(data.code, invoice.code);
        if (check) {
          //update data
          const encrypted = cryptr.encrypt(JSON.stringify(data.data));
          db.collection("invoices").updateOne(
            {
              _id: invoice._id,
            },
            {
              $set: {
                data: encrypted,
              },
            }
          );
          return res.status(204).end();
        } else {
          return res.status(400).json({ data: "Not Found" });
        }
      } else {
        //create a new invoice
        const hash = await bcrypt.hash(data.code, 10);
        const encrypted = cryptr.encrypt(JSON.stringify(data.data));
        db.collection("invoices").insertOne({
          name: data.name,
          code: hash,
          data: encrypted,
        });
      }
      return res.status(404).json({ data: "Not Found" });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ data: "Invalid Request" });
    }
  }
  return res.status(400).json({ data: "Invalid Request" });
}
