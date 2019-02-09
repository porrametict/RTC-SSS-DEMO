'use strict'

/*
|--------------------------------------------------------------------------
| SubjectSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class SubjectSeeder {
  async run () {
    const SubjectArray = await Factory
    .model('App/Models/Subject')
    .createMany(5)

  }
}

module.exports = SubjectSeeder
