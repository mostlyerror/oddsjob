const { normalizeDateYear } = require("../utils");
const url = require("url");
const path = require("path");

const pageFunction = ($, context) => {
  const matchDivs = $("li.KambiBC-event-item");

  return matchDivs
    .map((idx, el) => {
      let $el = $(el);

      const pageUrl = url.parse(context.pageUrl);
      let re = /event-item-(\d+)/;
      const eventId = $el.attr("class").match(re)[1];
      const detailPath = path.join(pageUrl.pathname, eventId);
      const detailUrl = url.format({
        protocol: pageUrl.protocol,
        hostname: pageUrl.host,
        pathname: detailPath
      });

      const date = $el
        .find(".KambiBC-event-item__start-time--date")
        .text()
        .trim();
      const time = $el
        .find(".KambiBC-event-item__start-time--time")
        .text()
        .trim();
      const dateTime = `${date} ${time}`;

      // this doesn't have a time zone attached.
      // there is a timestamp available on the match detail page
      // for now, the browser seems to default to local TZ (MDT)
      const matchTimestamp = normalizeDateYear(dateTime);

      const [boxer1Name, boxer2Name] = $el
        .find(".KambiBC-event-participants__name")
        .map((idx, el) => $(el).text().trim())
        .toArray();

      const [oddsBoxer1, oddsDraw, oddsBoxer2] = $el
        .find(".KambiBC-mod-outcome__odds-wrapper")
        .map((idx, el) => $(el).text().trim())
        .toArray();

      return {
        detailUrl,
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

module.exports = {
  sourceName: 'unibet',
  sportName: 'boxing',
  url: "https://www.unibet.com/betting/sports/filter/boxing",
  noMatchText: "not available at the moment",
  waitElementSelector: "li.KambiBC-event-item",
  waitElementTimeoutMS: 6000,
  pageFunction,
};
