const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const scrollPageToBottom = require('puppeteer-autoscroll-down');
const path = require('path');

(async function main() {
  const browser = await puppeteer.launch({
    headless: true
  })

  const page = await browser.newPage()

  try {
    await page.setViewport({ width: 1366, height: 768 })
    const url = 'https://www.unibet.com/betting/sports/filter/boxing'
    
    await page.goto(url, {
      waitUntil: ['networkidle0', 'load']
    }) 

    const noMatchMsgFound = await page.evaluate(() => {
      const string = 'not available at the moment'
      return document
        .querySelector('body')
        .innerText
        .includes(string)
    })

    if (noMatchMsgFound) {
      console.log('no matches available')
      return [];
    }
    
    const step = 250
    const delay = 100
    const lastPosition = await scrollPageToBottom(page, step, delay)
    console.log(`lastPosition: ${lastPosition}`)
    
    
    const matchSelector = 'li.KambiBC-event-item'
    const selectorTimeout = 5000
    await page.waitForSelector(matchSelector, {
      visible: true,
      timeout: selectorTimeout,
    });

    // await page.screenshot({ 
    //   path: path.normalize(`${__dirname}/boxing.png`) 
    // }) 

    const content = await page.content()
    const $ = cheerio.load(content)
    const matches = []
    const matchDivs = $(matchSelector)
    matchDivs.each((idx, el) => {
      const date = $(el)
        .find('.KambiBC-event-item__start-time--date')
        .text()
      
      const time = $(el)
        .find('.KambiBC-event-item__start-time--time')
        .text()

      const dateTime = `${date} ${time}`
      
      // this doesn't have a time zone attached.
      // there is a timestamp available on the match detail page
      // for now, the browser seems to default to local TZ (MDT)
      const matchTimestamp = new Date(dateTime).toISOString()

      const [ boxer1Name, boxer2Name ] = $(el)
        .first()
        .find(".KambiBC-event-participants__name")
        .map((idx, el) => $(el).text())
        .toArray()
        
      const [ oddsBoxer1, oddsDraw, oddsBoxer2 ] = $(el)
        .first()
        .find(".KambiBC-mod-outcome__odds-wrapper")
        .map((idx, el) => $(el).text())
        .toArray()
        
      matches.push({
        matchTimestamp,
        boxer1Name,
        boxer2Name,
        oddsBoxer1,
        oddsBoxer2,
        oddsDraw
      })
    })
    console.log(matches)
    return matches
  } catch (err) {
    console.error(err)
    browser.close()
  } finally {
    browser.close()
  }
})()
