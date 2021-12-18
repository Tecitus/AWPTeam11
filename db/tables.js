module.exports = async function (app){
    await app.knex.schema.createTable('roles', function (table) {
        table.increments('id').primary();
        table.string('name', 256).notNullable().unique();
        table.boolean('grantadmin').notNullable().defaultTo(false);
        table.boolean('editrole').notNullable().defaultTo(false);
        table.boolean('useredit').notNullable().defaultTo(false);
        table.boolean('allowregister').notNullable().defaultTo(false);
        table.boolean('changesettings').notNullable().defaultTo(false);
        table.boolean('editthread').notNullable().defaultTo(false);
    });

    await app.knex.schema.createTable('users', function (table) {
        table.increments('id').primary();
        table.string('uid', 64).notNullable().unique();
        table.string('password', 256).notNullable();
        table.string('nickname', 32).notNullable();
        table.string('salt', 64).notNullable();
        table.integer('role_id').unsigned().defaultTo(1);
        table.foreign('role_id').references('roles.id').deferrable('deferred');
    });

    await app.knex.schema.createTable('geolocations', function (table) {
        table.increments('id').primary();
        table.specificType("coordinates", "geometry(point, 4326)").unique();
    });

    await app.knex.schema.createTable('threads', function(table){
        table.increments('id').primary();
        table.text('content').notNullable();
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('users.id').deferrable('deferred');
        table.integer('geolocation_id').unsigned();
        table.foreign('geolocation_id').references('geolocations.id').deferrable('deferred');
    });

    await app.knex.schema.createTable('settings', function (table) {
        table.increments('id').primary();
        table.string('name', 256).notNullable().unique();
        table.string('value', 256);
    });
}