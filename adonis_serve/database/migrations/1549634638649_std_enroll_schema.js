'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StdEnrollSchema extends Schema {
  up () {
    this.create('std_enrolls', (table) => {
      table.increments()
      table.integer('std_id')
      table.string('sj_code')
      table.timestamps()
    })
  }

  down () {
    this.drop('std_enrolls')
  }
}

module.exports = StdEnrollSchema
