import Head from "next/head";
import InvoiceForm from "../components/invoiceForm";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <Head>
        <title>Invoice Creator</title>
        <meta name="description" content="Helps create simple invoices" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#2f6690" />
        <meta name="msapplication-TileColor" content="#2f6690" />
        <meta name="theme-color" content="#84b3d7" />
      </Head>
      <div className="flex-grow flex">
        <main className="flex flex-col justify-center items-center w-full h-full m-5">
          <InvoiceForm></InvoiceForm>
        </main>
        <aside className="m-5">
          <p>Type in your code to restore your info:</p>
        </aside>
      </div>
      <footer className="flex justify-center items-center">
        <p>copyright 2023</p>
      </footer>
    </div>
  );
}
