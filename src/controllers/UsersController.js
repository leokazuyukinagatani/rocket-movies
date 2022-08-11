const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const { hash , compare } = require("bcryptjs");


class UsersController {
  async create( request, response ) {
    const { name, email, password } = request.body;

    const userExist = await knex("users").where({email}).first();

    if(userExist){
      throw new AppError("email já existente");
    }

    const hashedPassword = await hash(password, 8);
    const created_at = knex.fn.now();
    const updated_at = knex.fn.now();

    await knex("users").insert({
      name,
      email,
      password:hashedPassword,
      created_at,
      updated_at
    });

    return response.status(201).json();
  }

  async update(request, response) {

    const { name, email , password, old_password } = request.body;

    const user_id = request.user.id;

    const user  = await knex("users").where({ id: user_id }).first();
     
    if(!user) {
      throw new AppError("Usuário não encontrado");
    }

    console.log(user.email);

   
    const userWithUpdatedEmail = await knex("users").where({ email }).first();
    

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
       throw new AppError("Este e-mail já está em uso");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if(!password && old_password) {
      throw new AppError("Você precisa informar a senha antiga e a nova senha!");
    }
    if(password && !old_password) {
      throw new AppError("Você precisa informar a senha antiga para definir a nova senha!");
    }

    const updated_at = knex.fn.now();

    if(password && old_password) {
      const checkedPassword = await compare(old_password, user.password);
      if(checkedPassword){
        const hashedPassword = await hash(password, 8);
        await knex("users")
        .where({ id: user_id })
        .update({
         name,
         email,
         password:hashedPassword,
         updated_at
         });
         return response.json();
      }else {
        throw new AppError("A senha antiga não foi informada corretamente.");
      }
    }
    await knex("users")
    .where({ id:user_id })
    .update({
     name,
     email,
     updated_at
     });
    

    return response.json();
  }

  async show( request, response ) {
    const { id } = request.params;
    
    const user = await knex("users").where({id}).first();

    if(!user){
      throw new AppError("nenhum usuário encontrado");
    }
    const movies = await knex("movie_notes").where("user_id", user.id).orderBy('title');
    return response.json({
      ...user,
      movies,
     });
  }

  async delete( request, response ) {
    const { id } = request.params;

    await knex("users").where({id}).delete();

    return response.json();
  }


} module.exports = UsersController;