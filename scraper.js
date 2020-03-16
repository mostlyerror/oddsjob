
const puppeteer = require('puppeteer');
const scrollPageToBottom = require('puppeteer-autoscroll-down');
// const path = require('path'); // for screenshotting?
const cheerio = require('cheerio');

const scrape = async function(config) {
  console.log('scrape() called')
  console.log(config)
  // do some validation on config/options object
  // initialize puppeteer browser
  const browser = await puppeteer.launch({
    headless: true
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1366, height: 768 })

  try {
    // navigate
    await page.goto(config.url, {
      waitUntil: ['networkidle0', 'load']
    }) 
    
    // check for no matches / events before scrolling
    const noMatchMsgFound = await page.evaluate((config) => {
      return document
        .querySelector('body')
        .innerText
        .toLowerCase()
        .includes(config.noMatchText.toLowerCase())
    }, config)

    if (noMatchMsgFound) {
      console.log('no matches available')
      return [];
    }

    // do the scroll
    const step = 250
    const delay = 100
    const lastPosition = await scrollPageToBottom(page, step, delay)

    // wait for element
    await page.waitForSelector(config.waitElementSelector, {
      visible: true,
      timeout: config.waitElementTimeoutMS || 6000,
    });

    // load dom into cheerio
    const content = await page.content()
    const $ = cheerio.load(content)
    const data = config.domHandler($)
    console.log(data)

  } catch (err) {
    console.error(err)
    browser.close()
  } finally {
    browser.close()
  }
}

module.exports = {
  scrape: scrape
}