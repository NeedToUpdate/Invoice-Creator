import Head from "next/head";
import Footer from "../components/footer";
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
      <main className="relative flex flex-col justify-center items-center w-full min-h-screen  h-full p-5 ">
        <div className="absolute w-full h-full dark:bg-slate-700  bg-cover bg-[url('/images/clouds_bg.webp')] dark:bg-[url('/images/clouds_bg_dark.webp')] z-0 blur-sm scale-105"></div>
        <InvoiceForm></InvoiceForm>
      </main>

      <Footer></Footer>
    </div>
  );
}
