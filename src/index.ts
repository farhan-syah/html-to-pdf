import "dotenv/config";
import { Server } from "hyper-express";
import { pino } from "pino";
import { PDFOptions } from "puppeteer";
import { Cluster } from "puppeteer-cluster";

const logger = pino();

// Types

interface Input {
  content: string;
  options?: PDFOptions;
}

// Utils

function tryParseInt(string?: string): number | undefined {
  return string ? parseInt(string) : undefined;
}

// Cluster

class PDFCluster {
  private cluster: Cluster<Input, Buffer>;

  constructor(cluster: Cluster<Input, Buffer>) {
    this.cluster = cluster;
    this.generateTask();
  }

  static async launch() {
    const cluster = await Cluster.launch({
      concurrency: tryParseInt(process.env.CONCURRENCY) ?? 2,
      maxConcurrency: tryParseInt(process.env.CONCURRENCY) ?? 5,
      puppeteerOptions: {
        headless: "new",
        args: [
          "--autoplay-policy=user-gesture-required",
          "--disable-background-networking",
          "--disable-background-timer-throttling",
          "--disable-backgrounding-occluded-windows",
          "--disable-breakpad",
          "--disable-client-side-phishing-detection",
          "--disable-component-update",
          "--disable-default-apps",
          "--disable-dev-shm-usage",
          "--disable-domain-reliability",
          "--disable-extensions",
          "--disable-features=AudioServiceOutOfProcess",
          "--disable-hang-monitor",
          "--disable-ipc-flooding-protection",
          "--disable-notifications",
          "--disable-offer-store-unmasked-wallet-cards",
          "--disable-popup-blocking",
          "--disable-print-preview",
          "--disable-prompt-on-repost",
          "--disable-renderer-backgrounding",
          "--disable-setuid-sandbox",
          "--disable-speech-api",
          "--disable-sync",
          "--hide-scrollbars",
          "--ignore-gpu-blacklist",
          "--metrics-recording-only",
          "--mute-audio",
          "--no-default-browser-check",
          "--no-first-run",
          "--no-pings",
          "--no-sandbox",
          "--no-zygote",
          "--password-store=basic",
          "--use-gl=swiftshader",
          "--use-mock-keychain",
          "--ignore-certificate-errors",
          "--disable-accelerated-2d-canvas",
          "--disable-gpu",
        ],
      },
    });
    return new PDFCluster(cluster);
  }

  private generateTask() {
    this.cluster.task(async ({ page, data }) => {
      await page.setContent(data.content, { waitUntil: "domcontentloaded" });
      const pdf = await page.pdf(data.options);
      return pdf;
    });
  }

  execute(data: Input) {
    return this.cluster.execute(data);
  }

  async close() {
    await this.cluster.idle();
    this.cluster.close();
  }
}

const pdfCluster = await PDFCluster.launch();

// PDF Builder

class PDFBuilder {
  async build(data: Input) {
    if (!data.content) "Content can't be empty";
    let blob = await pdfCluster.execute(data);
    return blob;
  }
}

const pdfBuilder = new PDFBuilder();

// Main Function

async function bootstrap() {
  const app = new Server();

  app.set_error_handler((req, res, err) => {
    logger.error(err);
    res.statusCode = 500;
    res.send("Internal Server Error");
  });

  app.post("/", async (req, res) => {
    let body = await req.json();
    let buffer = await pdfBuilder.build(body);
    res.setHeader("Content-Type", "application/pdf");
    res.send(buffer);
  });

  app.listen(tryParseInt(process.env.PORT) ?? 3000);

  console.log(`htmlToPdf is running at port:${app.port}`);
}

bootstrap();
