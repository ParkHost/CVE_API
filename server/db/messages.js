const db = require('./connection.js');

const CVE = db.get('CVE')

function getAll() {
  return CVE.find({}, { limit: 100});
}

function findCVE(search) {
  console.log(search);
  return CVE.find({'$text': { $search: search }}, { limit: 100});
}

function pagination(skip, limit, sort) {
  return CVE.find({"CVE_data_meta.STATE": "PUBLIC"}, {skip, limit, sort: sort});
}

function count(param) {
  return CVE.count({param});
}


function findId(id) {
  return CVE.find({_id: id});
}

module.exports = {
  getAll,
  findCVE,
  count,
  findId,
  pagination
};