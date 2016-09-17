exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", function(table){
    table.increments();
    table.string("email");
    table.string("first_name");
    table.string("password");
    table.integer("points");
    
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};
