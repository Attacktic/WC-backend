
exports.up = function(knex, Promise) {
  return knex.schema.createTable("poll_answers", function(table){
    table.increments();
    table.string("answer");
    table.integer("poll_id");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("poll_answers");
};
