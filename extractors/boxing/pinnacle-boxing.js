const { normalizeDateYear } = require("../utils");
const url = require('url')

const pageFunction = ($, context) => {
  const matchDivs = $('[data-test-id="Event.Row"]');

  return matchDivs
    .map((idx, el) => {
      let $el = $(el)

      const pageUrl = url.parse(context.pageUrl)
      const path = $el
        .find('a.eventGameInfo')
        .attr('href')
      const detailUrl = url.format({
        protocol: pageUrl.protocol,
        hostname: pageUrl.host,
        pathname: path
      })

      const date = $el
        .prev()
        .prevAll("[class^=style_dateBar]")
        .first()
        .text()
        .trim();

      const time = $el
        .find("[class^=style_time]")
        .text()
        .trim();

      const dateTime = `${date} ${time}`;
      // this doesn't have a time zone attached.
      // there is a timestamp available on the match detail page
      // for now, the browser seems to default to local TZ (MDT)
      const matchTimestamp = normalizeDateYear(dateTime);

      const [boxer1Name, boxer2Name] = $el
        .find("[class^=style_participantName]")
        .map((idx, el) => $(el).text().trim())
        .toArray();

      const [oddsBoxer1, oddsBoxer2] = $el
        .first()
        .find("span.price")
        .map((idx, el) => $(el).text().trim())
        .toArray();

      // https://www.pinnacle.com/en/help/betting-rules#Boxing
      // If the wagering offer on a match includes the draw as a third
      // option and the match ends in a draw, wagers on the draw will be
      // paid, while wagers on both fighters will be lost. If the wagering
      // offer includes only the two boxers, with the draw either not
      // offered or offered as a separate proposition, and the match ends in
      // a draw, wagers on either fighter will be refunded.

      return {
        detailUrl,
        matchTimestamp,
        boxer1Name,
        boxer2Name,
        oddsBoxer1,
        oddsBoxer2
        // oddsDraw // don't have example of draw html yet!
      };
    })
    .toArray();
};

module.exports = {
  sourceName: 'pinnacle',
  sportName: 'boxing',
  url: "https://www.pinnacle.com/en/boxing/matchups/",
  noMatchText: "There are no events to show",
  waitElementSelector: '[data-test-id="Event.Row"]',
  waitElementTimeoutMS: 6000,
  pageFunction,
};
