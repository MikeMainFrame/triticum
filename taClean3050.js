'use strict';
const fs = require( 'node:fs/promises' );
const path = require( 'node:path' );
const { Storage } = require( '@google-cloud/storage' );
const now = require('./timestamp.js' )
/*
We asume first line is heading line with names and that all lines must have same No of tabs
*/
async function main( name ) {

  let nOfbad = 0;
  let nOfGod = 0;

  log( 'M A I N ' );

  let fname = [];
  fname = name.split( '.' );
  const god = await fs.open( path.join( __dirname, fname[ 0 ] + now() + '_good_.' + fname[ 1 ] ), 'w' );
  const bad = await fs.open( path.join( __dirname, fname[ 0 ] + now() + '_bad_.' + fname[ 1 ] ), 'w' );

  await localFileSequential( name );

  log( 'M A I N   E X I T' );

  async function localFileSequential( file ) {


    let norm = 0;

    const fd = await fs.open( path.join( __dirname, file ) )

    for await ( const line of fd.readLines() ) {

      let candidate = line.toString().split( '\t' )

      if ( norm === 0 ) norm = candidate.length;

      ( candidate.length === norm ) ? good() : baad()

      function good() {
        god.write( Buffer.from( line + '\r\n', 'utf8' ) )
        nOfGod++;
      }
      function baad() {

        bad.write( Buffer.from( line + '\r\n', 'utf8' ) )
        nOfbad++;
      }
    }
    god.close();

    log( 'no of god/bad: ' + nOfGod + ' / ' + nOfbad);

  }

  function log( what ) {

    process.stdout.write( new Date().toISOString() + ' ' + what + '\r\n' );
  }
}
main( 'fredensborg.tsv' )
//ducq otha wmrq bkpb