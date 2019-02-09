'use strict'

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Hash = use('Hash')

Factory.blueprint('App/Models/User', (faker) => {
  return {
    username: faker.username(),
    email : faker.email(),
    password : 'password',
    code : faker.ssn({dashes: false}),
    first_name : faker.first() ,
    last_name : faker.last() 
  }
})


Factory.blueprint('App/Models/Teacher', (faker) => {
    return {
        username: faker.username(),
        email : faker.email(),
        password : 'password',
        first_name : faker.first() ,
        last_name : faker.last() 
    }
})

Factory.blueprint('App/Models/Subject', (faker) => {
    return {
        code : faker.ssn({ ssnFour: true }),
        name: faker.word({ length: 5 })
    }
})
