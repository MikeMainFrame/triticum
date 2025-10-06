
import * as XLSX from 'xlsx/xlsx.mjs';
import * as fs from 'fs';
import path from 'path';
XLSX.set_fs( fs );
import { Readable } from 'stream';
XLSX.stream.set_readable( Readable );
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
XLSX.set_cptable( cpexcel );
import { readdir } from 'node:fs/promises';

( async function initial() {

  let workbook = '';
  let output_file_name = '';
  const init = await readdir( path.join( import.meta.dirname, 'sheets' ) );

  console.table( init );

  init.forEach( ( sheet ) => {
    if ( sheet.indexOf( '.xlsx' ) > -1 ) {
      workbook = XLSX.readFile( path.join( import.meta.dirname, 'sheets', sheet ) );
      output_file_name = path.join( import.meta.dirname, 'output', sheet.split( '.' )[ 0 ] + '.csv' );
      let stream = XLSX.stream.to_csv( workbook.Sheets[ workbook.SheetNames[ 0 ] ] );
      stream.pipe( fs.createWriteStream( output_file_name ) );
    }
  } )

} )()