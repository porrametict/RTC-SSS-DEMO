'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ScoresSchema extends Schema {
  up () {
    this.create('scores', (table) => {
      table.increments()
      table.integer("room_id")
      table.string("std_code")
      table.integer("score")
      table.timestamps()
    })
  }

  down () {
    this.drop('scores')
  }
}

module.exports = ScoresSchema
