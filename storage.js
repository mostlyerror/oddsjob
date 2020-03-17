const fs = require("fs");
const path = require("path");

//   let data = {
//     url: "https://www.unibet.com/betting/sports/filter/boxing",
//     startTimestamp: "2020-03-17T18:43:07.448Z",
//     endTimestamp: "2020-03-17T18:43:14.261Z",
//     elapsedMS: 6813,
//     numResults: 9,
//     data: [
//       {
//         detailUrl:
//           "https://www.unibet.com/betting/sports/filter/boxing/1006129935",
//         matchTimestamp: "2020-04-11T21:00:00.000Z",
//         boxer1Name: "Dubois, Daniel",
//         boxer2Name: "Joyce, Joe",
//         oddsBoxer1: "1.24",
//         oddsBoxer2: "3.95",
//         oddsDraw: "26.00"
//       },
//       {
//         detailUrl:
//           "https://www.unibet.com/betting/sports/filter/boxing/1006193749",
//         matchTimestamp: "2020-04-18T01:00:00.000Z",
//         boxer1Name: "Braekhus, Cecilia",
//         boxer2Name: "McCaskill, Jessica",
//         oddsBoxer1: "1.12",
//         oddsBoxer2: "6.00",
//         oddsDraw: "21.00"
//       }
//     ]
//   };

module.exports.save = scrapeData => {
  const dataPath = path.resolve("." + "/data");
  const filename = `${scrapeData.sourceName}-${scrapeData.sportName}-${scrapeData.startTimestamp}.json`;
  const data = JSON.stringify(scrapeData, null, 2);

  fs.writeFile(path.resolve(dataPath, filename), data, err => {
    if (err) {
      console.error(err);
      throw err;
    }
    console.log(filename + " written to fs.");
  });
};
