var express = require('express');
var router = express.Router();
var allnote = {} ;
// declaration des variables qui contiennent la route vers mongodb et lurl pour ma connexion
var MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectId,// declaration de ObjectId qui appartient a mongodb donc le signaler ainsi a nodejs
    url = "mongodb://localhost:27017/Newnote";
  // connexion a la db cette fonction requiert 3 parametres: une url, un objet et une function de callback
  MongoClient.connect(url,
    {useNewUrlParser:true},
    function(err, client){
      if(err) throw err;

      var DB = client.db('NOTEAPP');

      console.log('je suis connecté');
  

/* GET users listing. exemple pour obtenir tous les users*/
  router.get('/', function(req, res, next) {
    allnote.get();
    DB.collection('notes').find({}).toArray(function(err, notes){
        if(err) throw err;
          // console.log(users);
          res.json(notes);
        });
     
    });


/* GET users listing. */


router.get('/:id', function(req, res, next) {
    // recupere lutilisateur dont lid est passe en parametre dans la db
    DB.collection('notes').findOne({_id: ObjectId(req.params.id)},function(err, notes){
      // s'il n'y a pas d'erreur
      if(err) throw err;

      // renvoi ce quon a recuperer dans la db correspondant a lid 
      res.json(notes);
    });

});


/* PUT users UPDATE account >>cinebat.dev/user/$id	*/
  router.put('/:id', function(req, res, next) {

    var session = allnote.get(req.cookies.token);
    if (req.params.id !== session._id.toString()){
      return res.send('Connexion échouée, veuillez vérifier vos identifiants');
    }
    
    var requiredProps = req.body;
    //var requiredProps = ['name','firstname', 'email', 'password','age'];
  // je verifie qu'il y ai bien des données reçues en post.
  //for(var i in requiredProps[i]) {
    // si les données reçue est indefinie répond que le champ est vide et coupe le script avec le return
    //if(typeof req.body[requiredProps[i]] == 'undefined'){
      if(typeof requiredProps == 'undefined'){
      //return res.send(requiredProps[i] + 'empty');
      return res.send(requiredProps + 'empty');
    }
  
    //  update dans la DB ou id = params id et tu affiche ok
    // allnote.get(req.cookies.token);
    DB.collection('notes').updateOne(
        {_id: ObjectId(req.params.id)},
              {$set:req.body},  
        function(err, result){
          if(err) throw err;
            res.json({
            result : 'Votre note à bien été modifié'
            });
            console.log(res.body);
        });
  });


router.post('/', function(req, res, next) {
  
  var requiredProps = ['titre','description', 'datecreat', 'datemodif'];
  // je verifie qu'il y ai bien des données reçues en post.
  for(var i in requiredProps[i]) {
    // si les données reçue est indefinie répond que le champ est vide et coupe le script avec le return
    if(typeof req.body[requiredProps[i]] == 'undefined'){
      return res.send(requiredProps[i] + 'empty');
    }
  }
  // si les données reçues ne sont pas indefinis alors tu les insert dans la DB et tu affiche ok + toutes les données corespondant a l'id
  DB.collection('notes').insertOne(req.body, function(err, result){
    
    if(err) throw err;

      res.json({
        result : 'ok',
        id : result.insertedId.toString()
      });

  });

});

/**
*@author isa 
*/
/* DELETE users delete account  >>cinebat.dev/user/$id */
  router.delete('/:id', function(req, res, next) {
    // recupere lutilisateur dont lid est passe en parametre dans la db
    DB.collection('notes').deleteOne({_id: ObjectId(req.params.id)},function(err, user){
      if(err) throw err;
      res.send('le compte a bien été supprimé');
    });
  });

});
module.exports = function(notes) {
  allnote = notes ;
  return router;
}
