'use strict';
import { open, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { stdout as _stdout } from 'node:process';
const SOURCE_THIS = 'taTransformCSV2TSV';
let batch = [];
/*
After extracting data from sheets we need to convert CSV. TSV is not an option, so we create it
*/
async function main( name ) {
  log( 'main entry name:' + name )
  const newname = name.split( '.' )[ 0 ] + '.tsv'
  const fdin = await open( join( import.meta.dirname, 'csv', name ), 'r' );
  const fdout = await open( join( import.meta.dirname, 'tsv', newname ), 'w' );

  const data = await fdin.readFile( { encoding: 'utf8' } );

  await fdout.write( data.split( ',' ).join( '\t' ) );

  await fdin.close();
  await fdout.close();
  log( 'main exit' )
  if ( batch.length > 0 ) main( batch.shift() );
}

async function initial() {
  const init = await readdir( join( import.meta.dirname, 'csv' ) );
  log( 'initial entry' )

  init.forEach( ( item ) => {
    log( 'initial name: ' + item )
    if ( item.indexOf( '.csv' ) > 0 ) batch.push( item )
  } )

  main( batch.shift() );
}

function log( what ) {

  process.stdout.write( `${SOURCE_THIS} ${new Date().toISOString()} ${JSON.stringify( what )}\r\n` );

  return;
}
initial();
//main( 'incoming/fredensborg.csv', 'incoming/fredensborg.tsv' )
