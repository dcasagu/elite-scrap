var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');
var domain = 'http://www.elitetorrent.nl';
var async = require('async');
var Q = require('q');
var options = {
    url: domain
};
var options = {

    estrenos720: {
        url:domain+'/calidad/720p-2/'
    },
    estrenos1080: {
        url:domain+'/calidad/1080p-10/'
    },
    search :{
        url : domain+'?s={str}&x=0&y=0'
    }
};

const express = require("express");
const app = express();
app.listen(3000, () => {
 console.log("El servidor está inicializado en el puerto 3000");
});

app.get('/', function (req, res) {
    res.send('Saludos desde express');
});

app.get('/status', function (req, res) {

    var status = {};
    status.server = 'OK';

    findBySearch('mitorrent').then(
        function(response){
            status.elitetorrent = 'OK';
            res.json(status); 
        }, function(error){
            status.elitetorrent = 'KO';
            res.json(status); 
        });
});

app.get('/search', function (req, res) {
    
    findBySearch(req.query['q']).then(

        function(response){
            console.log(response);
            res.json(response); 
        }, function(error){
            console.error("Error retrieving data" + response);
            res.json(error);
        })
});

app.get('/releases/1080p', function (req, res) {
    
    findEstrenos1080().then(

        function(response){
            console.log(response);
            res.json(response); 
        }, function(error){
            console.error("Error retrieving data" + response);
            res.json(error);
        })
});

app.get('/releases/720p', function (req, res) {
    
    findEstrenos720().then(

        function(response){
            console.log(response);
            res.json(response); 
        }, function(error){
            console.error("Error retrieving data" + response);
            res.json(error);
        })
});


findBySearch = function(str,page){
    var optionForSearch ={url: options.search.url.replace('{str}',str)};
    return findTorrents(optionForSearch,page);
};

findEstrenos1080 = function(page){
    return findTorrents(options.estrenos1080,page);
};

findEstrenos720 = function(page){
    return findTorrents(options.estrenos720,page);
};

function findTorrents(option,page){

    if(page) page = '/pag:'+page;
    else page = '';
    console.log(option);
    var optionWithPage = {url: option.url+page};
    var deferred = Q.defer();
    request(optionWithPage, function (err, resp, html) {

        if (err) deferred.reject(err);
        var $ = cheerio.load(html);
        var boxes = $('.miniboxs.miniboxs-ficha li');
        var links = _(boxes).map(function(box){
                                return $(box).find('a')
                            })
                            .map(function(link){
                                return $(link).attr('href')
                            })
                            .map(function(tLink){
                                return {url: tLink}
                            }).value();


        function iterateFun(link,callback) {
            request(link, function (err, resp, html) {

                callback(null, html);
            });
        }

        async.map(links,iterateFun,function(err,res){
            if(err) deferred.reject(err);
            var results = _(res).map(function(html){
                return cheerio.load(html);
            }).map(function($){
                var description = $('meta[name=description]').attr("content").split("torrent gratis. ")[1];
                description = description ? description.replace(/\r\n/,"").replace(/\:\s/,""): "";

                return {
                    title : /Descargar\s(.*)\spor\storrent/.exec($('#principal h1').text())[1],
                    desc: description,
                    magnet: domain + $($('.enlace_torrent')[1]).attr('href'),
                    torrent: domain + $($('.enlace_torrent')[0]).attr('href'),
                    quality: $('span:contains("Calidad:")').text(),
                    language: $('span:contains("Idioma:")').text(),
                    format: $('span:contains("Formato:")').text(),
                    size : $('span:contains("Tamaño:")').text()
                }
            }).value();

            deferred.resolve(results);
        });


    });

    return deferred.promise;

}