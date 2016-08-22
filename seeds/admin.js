
exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({id: 1, email: 'admin@admin', first_name: 'admin', password: "$2a$10$ebcp2vP14U7Byc6kWgcFE.nlGtQi92S6ODl941MANGbFkcoBAA20y"}),
        knex('users').insert({id: 2, email: 'dev@admin', first_name: 'dev', password: "$2a$10$ourqiB23TD6jFe6am.JZoeWifmojB1NzOOB3tZ9zNmtcA3lBR0swC"}),
      ]);
    });
};
