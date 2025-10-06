'use strict';
const fs = require( 'node:fs/promises' );
const path = require( 'node:path' );
const { argv}= require( 'node:process' );
const { Storage } = require( '@google-cloud/storage' );
const GROUP_KEY = 1;
const OUTPUT_STATEMENTS = 'output/outAppend.txt';
let batch = [];
let name = argv[0]  
async function main( name ) {


  process.stdout.write( new Date().toISOString() + ' M A I N   P R O C E S S E D   I N I T I A T E D\r\n' );
  process.stdout.write( new Date().toISOString() + ' file: ' + name + '\r\n' );

  const echo = await fs.open( path.join( __dirname, OUTPUT_STATEMENTS ), 'a' )

  const TSV = await localFileAll( name )

  let tsvA = new TabSeparatedValuesIntoArray( TSV, GROUP_KEY, null, 1 );

  echo.write( tsvA.tsv2fixed() );

  await echo.close();

  process.stdout.write( new Date().toISOString() + ' M A I N   P R O C E S S   C O M P L E T E D\r\n' );

  if ( batch.length > 0 ) main( batch.shift() )
}
async function localFileAll( file ) {

  try {
    const fd = await fs.open( path.join( __dirname, file ), 'r' )

    const all = await fd.readFile( { encoding: 'utf8' } )

    await fd.close();

    return all

  }
  catch {

    return getBucketFile( file )

  }
}
async function getBucketFile( objectName ) {

  const storage = new Storage();
  try {
    const all = await storage.bucket( 'triticum' ).file( objectName ).download()
    return all.toString( 'utf8' );
  }
  catch ( error ) {
    process.stdout.write( new Date().toISOString() + ' ' + error + '\r\n' );
    process.exit( 1 )
  }
}
async function initial( args, callback ) {
  const init = await fs.readdir( __dirname);

  init.forEach( ( item ) => {
    if ( item.indexOf( '.tsv' ) > -1 ) batch.push( item )
  } )


  main( batch.shift() );
}
//initial()

main('incoming/fredensborg1.txt')

