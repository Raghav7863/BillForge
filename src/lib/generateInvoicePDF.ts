import puppeteer from "puppeteer";

export async function generateInvoicePDF(
  invoiceId: string,
  cookie: string
): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
  });

  try {
    const page = await browser.newPage();

    // Render at desktop width so the responsive
    // Tailwind classes behave like the normal UI.
    await page.setViewport({
      width: 840,
      height: 1200,
      deviceScaleFactor: 1,
    });

    // Set authentication cookies
    const cookies = cookie
      .split(";")
      .map((item) => {
        const [name, ...rest] = item.trim().split("=");

        return {
          name,
          value: rest.join("="),
          domain: "localhost",
          path: "/",
        };
      })
      .filter(
        (cookie) => cookie.name && cookie.value
      );

    if (cookies.length > 0) {
      await page.setCookie(...cookies);
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const url = `${baseUrl}/invoices/${invoiceId}`;

    console.log("Puppeteer opening:", url);

    // IMPORTANT:
    // Don't use networkidle0.
    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    console.log("Page loaded");

    // Wait specifically for the invoice.
    await page.waitForSelector("#invoiceSheet", {
      timeout: 10000,
    });

    console.log("Invoice found");

    // Wait for fonts and images.
    await page.evaluate(async () => {
      if (document.fonts) {
        await document.fonts.ready;
      }

      const images = Array.from(
        document.images
      );

      await Promise.all(
        images.map((img) => {
          if (img.complete) {
            return Promise.resolve();
          }

          return new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
        })
      );
    });

    console.log("Fonts/images ready");

    /*
     * Hide the dashboard.
     * Only the invoice will be visible when printing.
     */
    await page.addStyleTag({
      content: `
        @page {
          size: A4;
          margin: 0;
        }

        html,
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
        }

        body > * {
          visibility: hidden !important;
        }

        #invoiceSheet,
        #invoiceSheet * {
          visibility: visible !important;
        }

        #invoiceSheet {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;

          width: 840px !important;
          max-width: 840px !important;

          margin: 0 !important;

          box-shadow: none !important;
          border-radius: 0 !important;

          transform: none !important;
          zoom: 1 !important;
        }
      `,
    });

    /*
     * Give the browser a moment to finish
     * layout/animation rendering.
     */
    await new Promise((resolve) =>
      setTimeout(resolve, 300)
    );

    /*
     * Check actual invoice dimensions.
     */
    const dimensions = await page.$eval(
      "#invoiceSheet",
      (element) => {
        const rect =
          element.getBoundingClientRect();

        return {
          width: rect.width,
          height: rect.height,
          scrollWidth: element.scrollWidth,
          scrollHeight: element.scrollHeight,
        };
      }
    );

    console.log(
      "Invoice dimensions:",
      dimensions
    );

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,

      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },

      /*
       * This scales the 840px invoice
       * onto an A4 page.
       */
      scale: 0.75,
    });

    const buffer = Buffer.from(pdf);

    console.log(
      "PDF size:",
      buffer.length
    );

    console.log(
      "PDF header:",
      buffer.subarray(0, 5).toString()
    );

    return buffer;
  } finally {
    await browser.close();
  }
}
