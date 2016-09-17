
exports.up = function(knex, Promise) {
  return knex.schema.createTable("polls", function(table){
    table.increments();
    table.string("title");
    table.string("active");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("polls");
};
