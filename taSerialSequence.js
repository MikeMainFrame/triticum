'use strict';
const fs = require( 'node:fs/promises' );
const path = require( 'node:path' );
const { Storage } = require( '@google-cloud/storage' );
const TabSeparatedValuesIntoArray = require( "./taTransformTSV" );
const GROUP_KEY = 6;

async function main( name, callback ) {


  process.stdout.write(   new Date().toISOString() + 'M A I N   P R O C E S S E D   I N I T I A T E D\r\n' );

  const echo = await fs.open( path.join( __dirname, 'outAppend.txt' ), 'a' )

  const TSV = await localFileAll( name )

  let tsvA = new TabSeparatedValuesIntoArray( TSV, GROUP_KEY, 'USDJPY', [ 6, 1, 12, 13, 14, 17, 18, 16 ] );

  echo.write( tsvA.tsv2fixed() );

  await echo.close();

  process.stdout.write(   new Date().toISOString() + 'M A I N   P R O C E S S   C O M P L E T E D\r\n' );

  callback()
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
    errorOutput.log( error )
  }
}
async function initial(args, callback) {

  const init = await fs.readdir( __dirname );
  let lib = [];

  init.forEach( ( item ) => {
    if ( item.indexOf( '.tsv' ) > -1 ) lib.push( item )
  } )
callback()
}
//initial()
//main( 'CC.tsv' )
//main( 'tsv/ClosedPositions_13516746_2024-09-30_2024-12-13.tsv' )
//'csv/x3050_CVR.tsv' );

async function localFileSequential( file ) {

  const fd = await fs.open( path.join( __dirname, file ) )

  let aggregate = '';

  for await ( const line of fd.readLines() ) {
    aggregate = aggregate + line.toString();
  }

  return aggregate;
}


const operations = [
  { func: initial, args: null },
  { func: main, args: 'CC.tsv' },
  { func: main, args: 'tsv/ClosedPositions_13516746_2024-09-30_2024-12-13.tsv' },
];

function executeFunctionWithArgs( operation, callback ) {
  const { args, func } = operation;
  func( args, callback );
}

function serialProcedure( operation ) {
  if ( !operation ) process.exit( 0 );
  executeFunctionWithArgs( operation, function ( result ) {
    serialProcedure( operations.shift() );
  } );
}



serialProcedure( operations.shift() );