'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TeacherTokenSchema extends Schema {
  up () {
    this.create('teacher_tokens', (table) => {
      table.increments()
      table.integer('teacher_id').unsigned().references('id').inTable('teachers')
      table.string('token', 255).notNullable().unique().index()
      table.string('type', 80).notNullable()
      table.boolean('is_revoked').defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('teacher_tokens')
  }
}

module.exports = TeacherTokenSchema
