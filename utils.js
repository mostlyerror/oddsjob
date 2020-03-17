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

// some tests..
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

module.exports = {
  normalizeDateYear
};
