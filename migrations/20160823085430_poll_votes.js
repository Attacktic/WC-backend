
exports.up = function(knex, Promise) {
  return knex.schema.createTable("poll_votes", function(table){
    table.increments();
    table.integer("answer_id");
    table.integer("user_id");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("poll_votes");
};
