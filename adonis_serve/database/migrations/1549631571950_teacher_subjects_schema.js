'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TeacherSubjectsSchema extends Schema {
  up () {
    this.create('teacher_subjects', (table) => {
      // table.increments()
      table.string("sj_code").notNullable()
      table.integer("t_id").notNullable()
    })
  }

  down () {
    this.drop('teacher_subjects')
  }
}
module.exports = TeacherSubjectsSchema


