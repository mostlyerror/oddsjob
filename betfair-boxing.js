const Scraper = require("./scraper");
const { normalizeDateYear } = require("./utils");

const domHandler = $ => {
  const matchDivs = $("li > div.event-information.ui-event");

  return matchDivs
    .map((idx, el) => {
      let $el = $(el);

      const dateTime = $el
        .find("span.date.ui-countdown")
        .text()
        .trim();

      // this doesn't have a time zone attached.
      // there is a timestamp available on the match detail page
      // for now, the browser seems to default to local TZ (MDT)
      // const matchTimestamp = new Date(dateTime).toISOString()
      const matchTimestamp = normalizeDateYear(dateTime);

      const [boxer1Name, boxer2Name] = $el
        .find(".teams-container .team-name")
        .map((idx, el) => $(el).text().trim())
        .toArray();

      const [oddsBoxer1, oddsDraw, oddsBoxer2] = $el
        .find(".ui-runner-price")
        .map((idx, el) => $(el).text().trim())
        .toArray();

      return {
        matchTimestamp,
        boxer1Name,
        boxer2Name,
        oddsBoxer1,
        oddsBoxer2,
        oddsDraw
      };
    })
    .toArray();
};

Scraper.scrape({
  url: "https://www.betfair.com/sport/boxing",
  noMatchText: "not available at the moment",
  waitElementSelector: "li > div.event-information.ui-event",
  waitElementTimeoutMS: 6000,
  domHandler: domHandler
});
