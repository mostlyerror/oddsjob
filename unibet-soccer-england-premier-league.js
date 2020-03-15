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
    const url = 'https://www.unibet.com/betting/sports/filter/football/england/premier_league/matches'
    
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

    const selector = '.c5d50'
    const selectorTimeout = 5000
    await page.waitForSelector(selector, {
      visible: true,
      timeout: selectorTimeout,
    });

    const step = 250
    const delay = 100
    const lastPosition = await scrollPageToBottom(page, step, delay)

    await page.screenshot({ 
      path: path.normalize(`${__dirname}/example.png`) 
    }) 
    console.log(`lastPosition: ${lastPosition}`)

    const content = await page.content()
    const $ = cheerio.load(content)
    console.log(`document content loaded`)


    const matches = []
    const matchDivs = $('._37348')
    matchDivs.each((idx, el) => {
      const dateTime = $(el)
        .first()
        .closest('.c5d50')
        .find('time')
        .attr('datetime')

      const matchTimestamp = new Date(dateTime).toISOString()

      const teamHomeName = $(el)
        .first()
        .find("[data-test-name='homeTeamName']")
        .text()

      const teamAwayName = $(el)
        .first()
        .find("[data-test-name='awayTeamName']")
        .text()

      const [ oddsHome, oddsDraw, oddsAway ] = $(el)
        .first()
        .find("[data-test-name='odds']")
        .map((idx, oddsEl) => $(oddsEl).text())
        .toArray()

      matches.push({
        matchTimestamp,
        teamHomeName,
        teamAwayName,
        oddsHome,
        oddsDraw,
        oddsAway
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
