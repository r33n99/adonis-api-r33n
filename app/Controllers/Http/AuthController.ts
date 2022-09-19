import User from 'App/Models/User';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import {schema,rules} from '@ioc:Adonis/Core/Validator'

export default class AuthController {
  public async register({request,response}:HttpContextContract){
    const validations = await schema.create({
      email:schema.string({},[
        rules.email(),
        rules.unique({table:'users',column:'email'})
      ]),
      password:schema.string({},[
        rules.confirmed()
      ]),
    })
    const data = await request.validate({schema:validations})
    const user = await User.create(data)
    return response.created(user)
  }

  public async login({request,response,auth}:HttpContextContract){
    const email = request.input('email')
    const password = request.input('password')
    const token = await auth.attempt(email,password)
    const user = await User.query().where('email', email)
      return response.json({'status':"loggin",user:user,auth:token})
  }
}
