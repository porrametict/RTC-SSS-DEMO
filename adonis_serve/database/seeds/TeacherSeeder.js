'use strict'

/*
|--------------------------------------------------------------------------
| TeacherSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class TeacherSeeder {
  async run () {
    const TeacherArray = await Factory
    .model('App/Models/Teacher')
    .createMany(5)
  }
}

module.exports = TeacherSeeder
