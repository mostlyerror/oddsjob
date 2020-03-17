const Scraper = require("./scraper");
const { normalizeDateYear } = require("./utils");

const domHandler = $ => {
  const matchDivs = $("section.coupon-content.more-info");

  return matchDivs
    .map((idx, el) => {
      let $el = $(el);

      const date = $el
        .find("sp-score-coupon.scores span.period")
        .text()
        .trim();

      const time = $el
        .find("sp-score-coupon.scores time.clock")
        .text()
        .trim();

      const dateTime = `${date} ${time}`
      // this doesn't have a time zone attached.
      // there is a timestamp available on the match detail page
      // for now, the browser seems to default to local TZ (MDT)
      // const matchTimestamp = new Date(dateTime).toISOString()
      const matchTimestamp = normalizeDateYear(dateTime);

      const [boxer1Name, boxer2Name] = $el
        .find("h4.competitor-name")
        .map((idx, el) => $(el).text().trim())
        .toArray();

      const [oddsBoxer1, oddsBoxer2] = $el
        .find("span.bet-price")
        .map((idx, el) => $(el).text().trim())
        .toArray();

      return {
        matchTimestamp,
        boxer1Name,
        boxer2Name,
        oddsBoxer1,
        oddsBoxer2,
        // oddsDraw // no example
      };
    })
    .toArray();
};

Scraper.scrape({
  url: "https://www.bovada.lv/sports/boxing",
  // noMatchText: "not available at the moment", // have not seen this yet
  waitElementSelector: ".grouped-events",
  waitElementTimeoutMS: 6000,
  domHandler: domHandler
});
