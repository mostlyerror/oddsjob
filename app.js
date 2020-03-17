global.__basedir = __dirname;

const fs = require("fs");
const path = require("path");

const Scraper = require("./scraper");
const Storage = require("./storage");

// just running boxing for now
const sport = "boxing";
const extractorsPath = path.resolve(__basedir + "/extractors/" + sport);

fs.readdirSync(extractorsPath)
  .forEach(async extractor => {
  const scrapeConfig = require(path.resolve(extractorsPath, extractor));

  // bug here, if one scraper fails, the whole chain is halted
  // perhaps we need like Promise.all([]) here?
  const data = await Scraper.scrape(scrapeConfig);

  Storage.save(data);
});