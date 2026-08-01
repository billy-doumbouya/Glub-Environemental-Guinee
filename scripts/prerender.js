// scripts/prerender.js
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, "../dist");
const PORT = 4173;

const ROUTES = [
  "/",
  "/a-propos",
  "/domaines",
  "/projets",
  "/partenaires",
  "/actualites",
  "/galerie",
  "/contact",
  "/don",
];

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const distance = 300;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        total += distance;
        if (total >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 100);
    });
  });
}

async function prerender() {
  const server = exec(`npx vite preview --port ${PORT} --strictPort`);
  await new Promise((r) => setTimeout(r, 2000));

  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: "shell",
  });

  for (const route of ROUTES) {
    const page = await browser.newPage();

    page.on("requestfailed", (req) =>
      console.warn(
        `  ⚠ requête échouée : ${req.url()} — ${req.failure()?.errorText}`,
      ),
    );

    try {
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(HTMLImageElement.prototype, "loading", {
          get() {
            return "eager";
          },
          set() {},
        });
      });

      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      await page
        .waitForFunction(() => window.__PRERENDER_READY__ === true, {
          timeout: 10000,
        })
        .catch(() =>
          console.warn(`⚠ ${route} : signal jamais reçu, capture quand même`),
        );

      await autoScroll(page);
      await new Promise((r) => setTimeout(r, 500));

      const html = await page.content();
      const outDir =
        route === "/" ? DIST : path.join(DIST, route.replace(/^\//, ""));
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, "index.html"), html);

      console.log(`✔ Pré-rendu : ${route}`);
    } catch (err) {
      console.error(`❌ Échec sur ${route} : ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.kill();
}

prerender().catch((err) => {
  console.error("❌ Échec du prerender :", err);
  process.exit(1);
});
