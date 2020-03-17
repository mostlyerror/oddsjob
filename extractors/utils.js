// most dates don't come with a year, the year 
// is assumed, like `11 Apr 15:00`

// var dt = '11 Apr 15:00'
// var d = new Date(dt).toISOString()
// console.log( normalizeDateYear(d) )
//
// var dt = '09 Jan 15:00'
// var d = new Date(dt).toISOString()
// console.log( normalizeDateYear(d) )
//
// var dt = '01 Mar 15:00'
// var d = new Date(dt).toISOString()
// console.log( normalizeDateYear(d) )
const normalizeDateYear = datetime => {
  const now = new Date();
  const nowYear = now.getYear();
  const dt = new Date(datetime);
  now.setYear(1900 + dt.getYear());
  if (now <= dt) {
    dt.setYear(1900 + nowYear);
  } else {
    dt.setYear(1900 + nowYear + 1);
  }
  return dt.toJSON();
};


const normalizeOdds = odds => {
  // determine if conversion needs to take place
  // are these american odds?
};


module.exports = {
  normalizeDateYear,
  normalizeOdds
};
