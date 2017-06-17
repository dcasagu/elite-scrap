var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');
var domain = 'http://www.elitetorrent.net';
var async = require('async');
var Q = require('q');
var options = {
    url: domain+'/categoria/17/peliculas-microhd'
};
var options = {

    microhd : {
        url:domain+'/categoria/17/peliculas-microhd'
    },
    hd : {
        url:domain+'/categoria/13/peliculas-hdrip'
    },
    estrenos: {
        url:domain+'/categoria/1/estrenos'
    },
    doctv: {
        url:domain+'categoria/6/docus-y-tv'
    },
    search :{
        url : domain+'/resultados/{str}'
    }
};

exports.findHd = function(page){
    return findTorrents(options.hd,page);
};

exports.findMicroHd = function(page){
    return findTorrents(options.microhd,page);
};

exports.findEstrenos = function(page){
    return findTorrents(options.estrenos,page);
};

exports.findDocTv = function(page){
    return findTorrents(options.doctv,page);
};

exports.findBySearch = function(str,page){
    var optionForSearch ={url: options.search.url.replace('{str}',str)};
    return findTorrents(optionForSearch,page);
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
        var links = _(boxes).map(function(box){return $(box).find('a')})
            .map(function(link){return $(link).attr('href')})
            .map(function(tLink){return {url: domain+tLink}}).value();


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
                var description = $('meta[name=Description]').attr('content').split("Sinopsis")[1];
                description = description ? description.replace(/\r\n/,"").replace(/\:\s/,""): "";

                return {
                    title : $('h2').html(),
                    image: domain+'/'+$('.secc-izq > img').attr('src'),
                    desc: description,
                    magnet: $($('.enlace_torrent')[1]).attr('href')
                }
            }).value();

            deferred.resolve(results);
        });


    });

    return deferred.promise;

}


exports.findHd().then(function(res){
    console.log(res);
});