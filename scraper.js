const puppeteer = require("puppeteer");
const scrollPageToBottom = require("puppeteer-autoscroll-down");
const cheerio = require("cheerio");

const scrape = async function(config) {
  const startTime = new Date();

  // do some validation on config/options object
  console.log("starting scrape() with config: ", config);

  // initialize puppeteer browser
  const browser = await puppeteer.launch({
    headless: true
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  try {
    // navigate
    await page.goto(config.url, {
      waitUntil: ["networkidle0", "load"]
    });

    // check for no matches / events before scrolling
    if (config.noMatchText != undefined) {
      const noMatchMsgFound = await page.evaluate(config => {
        return document
          .querySelector("body")
          .innerText.toLowerCase()
          .includes(config.noMatchText.toLowerCase());
      }, config);

      if (noMatchMsgFound) {
        console.log("no matches available");
        return [];
      }
    }

    // do the scroll
    const step = 250;
    const delay = 100;
    await scrollPageToBottom(page, step, delay);

    // wait for element
    await page.waitForSelector(config.waitElementSelector, {
      visible: true,
      timeout: config.waitElementTimeoutMS || 6000
    });

    // load dom into cheerio
    const content = await page.content();
    const $ = cheerio.load(content);

    // yield to extractor script to populate data
    const data = config.domHandler($, {
      pageUrl: page.url()
    });

    const endTime = new Date();
    const elapsedMS = endTime - startTime;
    const startTimestamp = startTime.toJSON();
    const endTimestamp = endTime.toJSON();
    const numResults = data.length;

    const scrapeResult = {
      url: config.url,
      startTimestamp,
      endTimestamp,
      elapsedMS,
      numResults,
      data
    };

    console.log(scrapeResult);
    return scrapeResult;
  } catch (err) {
    console.error(err);
    browser.close();
  } finally {
    browser.close();
  }
};

module.exports = {
  scrape: scrape
};
