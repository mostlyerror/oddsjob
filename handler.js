'use strict';

const { extractOddsFromHTML } = require('./helpers.js')
module.exports.getOdds = (event, context, callback) => {
  const scrapeBeginTimestamp = new Date().toISOString()
  const matches = extractOddsFromHTML()
  const scrapeEndTimestamp = new Date().toISOString()
  const scrapeData = {
    scrapeBeginTimestamp,
    scrapeEndTimestamp,
    data: matches
  }
  console.log(scrapeData)
};
