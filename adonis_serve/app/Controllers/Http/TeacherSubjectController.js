'use strict'

const TS = use('App/Models/TeacherSubject') 
const Database = use('Database')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with teachersubjects
 */
class TeacherSubjectController {
  /**
   * Show a list of all teachersubjects.
   * GET teachersubjects
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    let form = request.all();
    //  console.log(form.id,'t_id')
    // let ts =  await TS.query().where('t_id',form.id).with('hasmany_subject').fetch()
    let data = await Database.select('subjects.code','subjects.name').from('teacher_subjects')
    .where('t_id',form.id)
    .innerJoin('subjects','teacher_subjects.sj_code','subjects.code')


    
    return data;

    
    
  }

  /**
   * Render a form to be used for creating a new teachersubject.
   * GET teachersubjects/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
    return {
      "sj_code" : null,
      "t_id" : null
    }
  }

  /**
   * Create/save a new teachersubject.
   * POST teachersubjects
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    let rq = request.all()
    //console.log(rq,"rq")
    let ts = new TS () ;
    ts.fill(rq);
    await ts.save()
    return ts;
  }

  /**
   * Display a single teachersubject.
   * GET teachersubjects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    
  }

  /**
   * Render a form to update an existing teachersubject.
   * GET teachersubjects/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update teachersubject details.
   * PUT or PATCH teachersubjects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a teachersubject with id.
   * DELETE teachersubjects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = TeacherSubjectController
