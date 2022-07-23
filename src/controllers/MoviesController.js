const AppError = require("../utils/AppError");
const knex = require("../database/knex");


class MoviesController {
  async create( request, response ) {
    const { title, description, rating } = request.body;

    const user_id  = request.user.id;
    console.log(request.body);
    console.log(user_id);

    const moviesExist = await knex("movie_notes").where({user_id}).where({title}).first();
    console.log(moviesExist);

    if(moviesExist){
     throw new AppError("filme já existente");
    }
    
    const created_at = knex.fn.now();
    const updated_at = knex.fn.now();

    await knex("movie_notes").insert({
      title,
      description,
      rating,
      user_id,
      created_at,
      updated_at
    }) 

    return response.status(201).json();
  }

  async update(request, response) {

    const { title, description, rating } = request.body;
    const { user_id } = request.params;


    const moviesExist = await knex("movie_notes").where({user_id}).where({title}).first();
    console.log(moviesExist);
    if(moviesExist) {
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
    }else {
      throw new AppError("titulo de filme não existe");
    }
  }

  async show( request, response ) {
    const { id } = request.params;
    const movie = await knex("movie_notes").where({id}).first();
    console.log(movie);

    if(movie){
      return response.json({
         movie
      });
    }else {
      throw new AppError("nenhum filme com este id encontrado");
    }
  }

  async delete( request, response ) {
    const { id } = request.params;
    const movie = await knex("movie_notes").where({id}).first();
    if(movie){
      await knex("movie_notes").where({id}).delete();

      return response.json();
    }else{
      throw new AppError("id do filme não encontrado");
    }
   }

  async index( request, response ) {

    const { title, tags } = request.query;
    const  user_id  = request.user.id;

    let movies;

    if(tags) {
      const filterTags = tags.split(',').map(tag => tag);
      movies =  await knex("movie_tags")
        .select([])
    }
    if(!movies){
      throw new AppError("Não foi encontrado nenhum filme");
    }else{
      return response.json({movies});
    }
  }


} module.exports = MoviesController;