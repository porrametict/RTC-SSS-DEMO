'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RoomHostSchema extends Schema {
  up () {
    this.create('room_hosts', (table) => {
     // table.increments()
     table.integer('room_id')
     table.integer('host_id')
     table.timestamps()
     
      //table.timestamps()
    })
  }

  down () {
    this.drop('room_hosts')
  }
}

module.exports = RoomHostSchema
