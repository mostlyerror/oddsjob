const cheerio = require('cheerio')
const moment = require('moment')
const Scraper = require('./scraper')

const domHandler = $ => {
  const matchDivs = $('li.KambiBC-event-item')

  return matchDivs.map((idx, el) => {
    let $el = $(el)

    const date = $el
    .find('.KambiBC-event-item__start-time--date')
    .text()
    
    const time = $el
    .find('.KambiBC-event-item__start-time--time')
    .text()
    
    const dateTime = `${date} ${time}`
    // this doesn't have a time zone attached.
    // there is a timestamp available on the match detail page
    // for now, the browser seems to default to local TZ (MDT)
    const matchTimestamp = new Date(dateTime).toISOString()
    
    const [ boxer1Name, boxer2Name ] = $el
      .first()
      .find(".KambiBC-event-participants__name")
      .map((idx, el) => $(el).text().trim())
      .toArray()
    
    const [ oddsBoxer1, oddsDraw, oddsBoxer2 ] = $el
      .first()
      .find(".KambiBC-mod-outcome__odds-wrapper")
      .map((idx, oddsEl) => $(oddsEl).text().trim())
      .toArray()
    
    return {
      matchTimestamp,
      boxer1Name,
      boxer2Name,
      oddsBoxer1,
      oddsBoxer2,
      oddsDraw
    }
  }).toArray()
}

Scraper.scrape({
  url: 'https://www.unibet.com/betting/sports/filter/boxing',
  noMatchText: 'not available at the moment',
  waitElementSelector: 'li.KambiBC-event-item',
  waitElementTimeoutMS: 6000,
  domHandler: domHandler
})
