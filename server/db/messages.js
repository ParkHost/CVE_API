const db = require('./connection.js');
const Joi = require('joi');

// const schema = Joi.object().keys({
//   username: Joi.string().alphanum().required(),
//   subject: Joi.string().required(),
//   message: Joi.string().max(500).required(),
//   imageURL: Joi.string().uri({
//     scheme: [
//       /https?/
//     ]
//   })
// });


const CVE = db.get('CVE')

function getAll() {
  return CVE.find({}, { limit: 100});
}

function findCVE(search) {
  return CVE.find({'$text' : { $search: search}}, { limit: 100});
}

function count() {
  return CVE.count({});
}

function findId(id) {
  return CVE.find({_id: id});
}

// function create(message) {
//   const result = Joi.validate(message, schema);
//   if(result.error === 0) {
//     message.created = new Date();
//     return messages.insert(message);
//   } else {
//     return Promise.reject(result.error);
//   }
// }

module.exports = {
  getAll,
  findCVE,
  count,
  findId
};