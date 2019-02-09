'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RoomsSchema extends Schema {
  up () {
    this.create('rooms', (table) => {
      table.increments()
      table.string("name")
      table.string("sj_code")
      table.string('status').defaultTo("off")
      table.timestamps()
    })
  }

  down () {
    this.drop('rooms')
  }
}

module.exports = RoomsSchema



