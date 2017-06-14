# ELITE-SCRAPER

Scraper de EliteTorrent. Devuelve las principales paginas y busquedas de Elite torrent en JSON

## Buscar por secciones
```javascript
var elite = require('elite-scrap');
elite.findHd().then(function(resultados){
    console.log(resultados)
});

/*
[ { title: 'Un traidor como los nuestros (HDRip)',
    image: 'http://www.elitetorrent.net/thumb_fichas/35865_g.jpg',
    desc: 'Una joven pareja británica se va de vacaciones a Marruecos. Allí conocen a un carismático millonario ruso que asegura pertenecer a la mafia rusa, donde es el mejor del mundo blanqueando dinero. El mafioso les invita a una fiesta donde les pide ayuda para solicitar asilo político en Inglaterra a cambio de contar todo lo que sabe, desenmascarando a todos los implicados, sus compañeros mafiosos, banqueros e incluso políticos británicos... Adaptación de la novela homónima de John le Carré.',
    magnet: 'magnet:?xt=urn:btih:7BRCDR53V7QOZAD3QPOMMMKG5M3KUX5E&dn=Un+traidor+como+los+nuestros+%28HDRip%29+%28EliteTorrent.net%29&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce' },
  { title: 'Marea negra (HDRip)',
    image: 'http://www.elitetorrent.net/thumb_fichas/35863_g.jpg',
    desc: 'Basado en los eventos sucedidos en el Golfo de México en abril del 2010, cuando un accidente en un oleoducto causó una catástrofe que mató a 11 personas e hirió a otras 16, provocando además una de las catástrofes medioambientales más graves causadas por el hombre.',
    magnet: 'magnet:?xt=urn:btih:FOXCURVKORORR7TTM6W7IQGV43YMX3KU&dn=Marea+negra+%28HDRip%29+%28EliteTorrent.net%29&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce' },
  .
  .
  .]
*/
```
### Metodos
- HD: ''findHd()''
- MicroHD : ''findMicroHd()''
- Estrenos : ''findEstrenos()''
- Documentales y tv : ''findDocTv()''


## Busqueda por cadena de texto
```javascript
var elite = require('elite-scrap');
elite.findBySearch('Some stuff').then(function(resultados){
    console.log(resultados);
});
```

### Paginacion de los resultados
```javascript
var elite = require('elite-scrap');
/*Parámetro 2 es el numero de pagina (en EliteTorrent de los que se muestran resultados*/
elite.findBySearch('Some stuff',2).then(function(resultados){
    console.log(resultados);
});

elite.findMicroHd(2).then(function(resultados){
    console.log(resultados);
});
```
