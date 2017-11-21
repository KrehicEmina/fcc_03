var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

var mongodb=require("mongodb")
var MongoClient = mongodb.MongoClient;

var mongo_uri ="mongodb://user:pass@ds117136.mlab.com:17136/freecodecamp";

var validUrl = require('valid-url');
var shortId = require("shortid");

app.use("/", express.static('public'));

 MongoClient.connect(mongo_uri,function(err,db){
   	if (err) {
        console.log(err);
    }

	else{
		app.get("/new/:url(*)", (req, res) => {
			var url = req.params.url;
       		if (validUrl.isUri(url)){
        		console.log("Url is valid");
				var urlList = db.collection('url-list');
                var shortUrl = shortId.generate();
                urlList.insert({longUrl: url, shortUrl: shortUrl}, function(){
                    var data = {
                        long_url: url,
                        short_url: 'http://'+req.headers['host']+'/'+shortUrl
                    }
                    db.close();
                    res.send(data);
                });
    		}
		
    		else {
        		res.end("Please enter vaild url");
        		return;
    		}
    	});   





		app.get('/:id',function(req, res){
			var id = req.params.id;
 	        var urlList = db.collection('url-list');
          	urlList.find({shortUrl:id}).toArray(function(err,docs){
              if(err){
                  res.end(err);
                  
              } 
              else {

                    if(docs.length>0){
                        db.close();
                        res.redirect(docs[0].longUrl);
                    } else {
                        db.close();
                        res.end('Not Found!')
                    }
              }
          })
      
  })
}});


app.listen(port)