const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const { hash , compare } = require("bcryptjs");


class UsersController {
  async create( request, response ) {
    const { name, email, password } = request.body;

    const checkUserExists = await knex("users")
    .where({ email });
    
    if(checkUserExists){
      throw new AppError("Este email já esta sendo utilizado!");
    }

    const hashedPassword = await hash(password, 8);


    await knex("users").insert({
      name,
      email,
      hashedPassword
    });


    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email , password, old_password} = request.body;
    const { id } = request.params;

   
    const user = await knex("users")
    .where({ id });

    if(!user) {
      throw new AppError("Usuário não encontrado");
    }

    const userWithUpdatedEmail = await knex("users")
    .where({ email });

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
      throw new AppError("Este e-mail já está em uso");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if(password && !old_password) {
      throw new AppError("Você precisa informar a senha antiga para definir a nova senha!");
    }

    if(password && old_password) {
      const checkedPassword = await compare(old_password, user.password);
      
      if(!checkedPassword){
        throw new AppError("A senha antiga não foi informada corretamente.");
      }

      password = await hash(password, 8);
    }

    const updated_at = knex.fn.now();

    await knex("users")
      .where({ id })
      .update({
      name,
      email,
      password,
      updated_at
    });

    return response.json();
  }

  async show( request, response ) {
    const { id } = request.params;
    
    const user = await knex("users").where({id});
    const notes = await knex("movie_notes").where({user_id:id}).orderBy("name");
    
    return response.json({
      ...user,
      notes,
    });
  }

  async delete( request, response ) {
    const { id } = request.params;

    await knex("users").where({id}).delete();

    return response.json();
  }


} module.exports = UsersController;