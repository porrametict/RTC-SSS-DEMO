'use strict'

const StdEnroll = use('App/Models/StdEnroll')
const Database = use('Database')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with studentenrolls
 */
class StudentEnrollController {
  /**
   * Show a list of all studentenrolls.
   * GET studentenrolls
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {

    let form = request.all()
    let data  = await Database.select('subjects.name','subjects.code').from('std_enrolls')
    .where('std_id',form.id)
    .innerJoin('subjects','std_enrolls.sj_code','subjects.code')
    return data
  }

  /**
   * Render a form to be used for creating a new studentenroll.
   * GET studentenrolls/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
    return {
      "sj_code" : null,
      "std_id" : null
    }
  }

  /**
   * Create/save a new studentenroll.
   * POST studentenrolls
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {

    let rq = request.all();
    let std_enroll = new StdEnroll ();
    std_enroll.fill(rq)
    await std_enroll.save();
    return std_enroll;
  }

  /**
   * Display a single studentenroll.
   * GET studentenrolls/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing studentenroll.
   * GET studentenrolls/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update studentenroll details.
   * PUT or PATCH studentenrolls/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a studentenroll with id.
   * DELETE studentenrolls/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = StudentEnrollController
