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

    const { title } = request.query;
    const user_id = request.user.id;
    let notes;

    if(!title){
      notes = await knex("movie_notes")
        .where({user_id})
        .orderBy("title");
    }else{
      notes = await knex("movie_notes")
        .where({user_id})
        .whereLike("title", `%${ title }%`)
        .orderBy("title");
    }

    const userTags = await knex("movie_tags").where({user_id});
    const notesWithTags = notes.map(note => {
      const noteTags = userTags.filter(
        tag => tag.note_id === note.id
      )

      return({
        ...note,
        tags: noteTags
      })
    })
    return response.json(notesWithTags);
  }

  async show(request, response){
    const { id } = request.params;
    const movie = await knex("movie_notes").where({id}).first();
    if(!movie){
      throw new AppError("Filme não encontrado");
    }
    const tags = await knex("movie_tags").where({note_id: id});

    return response.json({movie,tags});
  }

} module.exports = MoviesController;