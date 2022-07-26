const AppError = require("../utils/AppError");
const knex = require("../database/knex");


class MoviesController {
  async create( request, response ) {
    const { title, description, rating, tags } = request.body;

    const user_id  = request.user.id;


    const noteExist = await knex("movie_notes").where({user_id}).where({title}).first();

    if(noteExist){
     throw new AppError("filme já existente");
    }
    
    const created_at = knex.fn.now();
    const updated_at = knex.fn.now();

    const note_id = await knex("movie_notes").insert({
      title,
      description,
      rating,
      user_id,
      created_at,
      updated_at
    }) 

    const tagsInsert = tags.map(name => {
      return{
        note_id,
        name,
        user_id
      }
    });

    await knex("movie_tags").insert(tagsInsert);

    return response.status(201).json();
  }

  

  async update(request, response) {

    const { title, description, rating } = request.body;
    const { user_id } = request.params;


    const noteExist = await knex("movie_notes").where({user_id}).where({title}).first();

    if(!noteExist){
      throw new AppError("titulo de filme não existe");
    }
   
    const updated_at = knex.fn.now();
    await knex("movie_notes")
      .where({ user_id })
      .update({
      title,
      description,
      rating,
      updated_at
    });
    return response.json();
   
  }

  async show( request, response ) {
    const { id } = request.params;
    const note = await knex("movie_notes").where({id}).first();

    if(!note){
      throw new AppError("nenhum filme com este id encontrado");
    }
    
    const tags = await knex("movie_tags").where({note_id:id}).orderBy("name");

    return({...note, tags});
  }

  async delete( request, response ) {
    const { id } = request.params;
    const note = await knex("movie_notes").where({id}).first();
    if(!note){
      throw new AppError("id do filme não encontrado");
    }
    await knex("movie_notes").where({id}).delete();

    return response.json(); 
  }

  async index( request, response ) {

    const { title, tags } = request.query;
    const  user_id  = request.user.id;

    const notes = await knex("movies_note").where({ user_id }).orderBy("title");

    if(tags) {
      const filterTags = tags.split(',').map(tag => tag);
      notes =  await knex("movie_tags")
        .select([])
    }

    if(!notes){
      throw new AppError("Não foi encontrado nenhum filme");
    }
    return response.json({...notes, tags});
    
  }


} module.exports = MoviesController;