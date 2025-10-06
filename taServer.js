'use strict';
const { Storage } = require( '@google-cloud/storage' );
const https = require( 'node:http' );
const fs = require( 'node:fs' );
const path = require( 'node:path' );
const process = require( 'node:process' );
const stream = require( 'node:stream' );
const symbolData = require( './taSymbolPeriod.js' );
const myname = 'taServer.js';
var pileUp = [];
var argGet = '';
var reqURL = '';
/*
*
*/
https.createServer().on( 'request', main ).listen( 3000 );

/*
* Main is just declarations and some global vars, which is needed due to the event driven nature
*/
async function main ( request, response ) {

  request.on( 'data', collect_data.bind( this ) );
  request.on( 'end', process_request.bind( this, request, response ) );
  request.on( 'error', log.bind( this ) );

  response.on( 'close', log.bind( this, 'done' ) );
  response.on( 'error', log.bind( this ) );

  response.statusCode = 200; // until trouble we assume ok ...
  response.statusMessage = 'All Good';
  response.setEncoding = ( 'utf8' );
  
  reqURL = new URL('https://' +request.headers.host + '/' +  request.url);
  log(request.headers['user-agent']);
  log(request.headers['host']);
  
  let params = new URLSearchParams(reqURL['search']);
  log(params.get('filter'));
  log(params.get('filterx'));

  //reqURL = new URL( 'https://localhost:3000/' + request.url );

  if ( reqURL.search.length > 0 ) argGet = reqURL.search; // there are several request per roundtrip. We try to grab the first one
}
/*
* main has just one child and it could be inside - 
* but we keep good left margin, by using separate functions
*/
async function process_request ( request, response ) {

  if ( pileUp.length > 0 ) log( Buffer.concat( pileUp ).toString() ); // end wire - must connect to real storage

  log( `REQUEST: ${request.method}  ${reqURL}` );

  const file = path.join( __dirname, reqURL.pathname );

  /* check for domestic file if no exixtence, try cloud
  if not file request, then try various end points
  */
  if ( file.split( '.' ).length === 2 ) {
    fs.createReadStream( file )
      .on( 'error',
        async ( msg ) => {

          log( 'readfile ' + file + msg );

          let cloud = file.split( '\\' ).pop();
          const storage = new Storage();
          const S = await storage.bucket( 'triticumarchives' ).file( cloud );
          S.createReadStream()
            .on( 'error', ( err ) => {

              log( 'read API ' + file + err );

              response.statusCode = 404;
              response.end( '<h1>Problems ' + file + '</h1>', 'utf-8' );
            } )
            .pipe( response );
        } )
      .pipe( response );

  } else {

    switch ( reqURL.pathname ) {

      case '//SYMBOL': {
        let slam = await symbolData(); client_response( slam, response );
        break;
      }
      case '//IBM/Manuals': {
        await IBM_Manuals();
        break;
      }
      case '//tsv/taCorpEthics': {
        await closed_position( argGet );
        break;
      }
      //case '//csv/x3050_CVR': await closed_position(); break;
      default: response.end( '<h1>Problems ' + reqURL + '</h1>', 'utf-8' );
    }

  }
  async function closed_position ( search ) {

    const params = new URLSearchParams( search );

    let file = params.get( "file" );

    const storage = new Storage();
    const S = await storage.bucket( 'triticum' ).file( file );

    S.createReadStream()
      .on( 'error',
        ( err ) => {
          console.log( err );
          response.statusCode === 404;
          response.end( '<h1>Problems ' + fileBucket + ' | ' + err + '</h1>', 'utf-8' );
        } )
      .pipe( response );

  }
  async function IBM_Manuals () {

    let lines = [];
    const storage = new Storage();
    const [ fileObjects ] = await storage.bucket( 'triticumarchives' ).getFiles( { prefix: 'IBM' } );


    for ( let jx = 0; jx < fileObjects.length; jx++ ) {
      const F = fileObjects[ jx ];
      lines.push( `${F.name}\t${F.metadata.updated}\t${F.metadata.timeCreated}\t${F.metadata.size}\t${F.metadata.generation}\t${F.metadata.bucket}\r\n` );
    }

    response.setHeader( 'Content-Type', 'application/json' );
    response.write( lines.join( '' ) );
    response.statusCode = 200;
    response.statusMessage = 'data extracted';
    response.end();

  }
}

function collect_data ( streamBytes ) {

  pileUp.push( streamBytes );

  return;
}
function client_response ( what, response ) {

  response.setHeader( 'Content-Type', 'application/json' );
  response.write( JSON.stringify( what, null, 2 ) );
  response.statusCode = 200;
  response.statusMessage = 'data extracted';
  response.end();

}
function log ( what ) {

  process.stdout.write( myname + ' ' + new Date().toISOString() + ' ' + JSON.stringify( what ) + '\r\n' );

  return;
}