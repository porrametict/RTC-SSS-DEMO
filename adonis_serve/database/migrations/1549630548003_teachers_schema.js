'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TeachersSchema extends Schema {
  up () {
    this.create('teachers', (table) => {
      table.increments()
      table.string("first_name")
      table.string("last_name")
      table.string("email").notNullable().unique()
      table.string("username").notNullable().unique()
      table.string("password").notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('teachers')
  }
}

module.exports = TeachersSchema
