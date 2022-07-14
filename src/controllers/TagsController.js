const AppError = require("../utils/AppError");
const knex = require("../database/knex");


class TagsController {
  async create( request, response ) {
    const { name } = request.body;
    const { note_id, user_id } = request.query;

    const noteExist = await knex("movie_notes").where('id',String(note_id)).first();
    if(!noteExist){
      throw new AppError("Filme não existe");
    }

    const isUserNote = (noteExist.user_id == user_id);
    if(isUserNote) {
      const isTagExist = await knex("movie_tags").where({name}).first();
      if(!isTagExist){
        await knex("movie_tags").insert({name, note_id, user_id});
      }else {
        throw new AppError("Tag já existe");
      }
    }else{
      throw new AppError("Nota do filme não pertence ao usuário informado");
    }
    return response.status(201).json();
  }

  async show( request, response ) {
    const { id } = request.params;
    console.log(id);
    const tag = await knex("movie_tags").where({id}).first();
    console.log(tag);

    if(tag){
      return response.json({
         tag
      });
    }else {
      throw new AppError("nenhuma tag com este id encontrado");
    }
  }

  async delete( request, response ) {
    const { id } = request.params;
    const tag = await knex("movie_tags").where({id}).first();
    if(tag){
      await knex("movie_tags").where({id}).delete();

      return response.json();
    }else{
      throw new AppError("id da tag não encontrado");
    }
   }

  async index( request, response ) {
    const { user_id } = request.query;
    const tags = await knex("movie_tags").where({user_id});
    console.log(tags);
    return response.json();
  }


} module.exports = TagsController;