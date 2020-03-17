const Scraper = require("./scraper");
const { normalizeDateYear } = require("./utils");

const domHandler = $ => {
  const matchDivs = $("._37348");
  return matchDivs
    .map((idx, el) => {
      const dateTime = $(el)
        .first()
        .closest(".c5d50")
        .find("time")
        .attr("datetime");

      const matchTimestamp = normalizeDateYear(dateTime);

      const teamHomeName = $(el)
        .first()
        .find("[data-test-name='homeTeamName']")
        .text()
        .trim();

      const teamAwayName = $(el)
        .first()
        .find("[data-test-name='awayTeamName']")
        .text()
        .trim();

      const [oddsHome, oddsDraw, oddsAway] = $(el)
        .first()
        .find("[data-test-name='odds']")
        .map((idx, oddsEl) => $(oddsEl).text().trim())
        .toArray();

      return {
        matchTimestamp,
        teamHomeName,
        teamAwayName,
        oddsHome,
        oddsDraw,
        oddsAway
      };
    })
    .toArray();
};

Scraper.scrape({
  url:
    "https://www.unibet.com/betting/sports/filter/football/england/premier_league/matches",
  noMatchText: "not available at the moment",
  waitElementSelector: ".c5d50",
  waitElementTimeoutMS: 6000,
  domHandler: domHandler
});
