const db = require('../database/dbConfig.js');

const find = () => (
  db('users').select('id', 'username', 'password')
);

const findBy = filter => (
  db('users').where(filter)
);

const findById = id => (
  db('users')
    .where({ id })
    .first()
);

const add = async user => {
  const [id] = await db('users').insert(user);

  return findById(id);
};

module.exports = {
  add,
  find,
  findBy,
  findById
};