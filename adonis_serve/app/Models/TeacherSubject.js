'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TeacherSubject extends Model {
    
    hasmany_subject () {
        return this.hasMany('App/Models/Subject','sj_code','code')
    }
    
}

module.exports = TeacherSubject
