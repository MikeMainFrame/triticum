'use strict';

const { DatabaseSync } = require( 'node:sqlite' );
const database = new DatabaseSync( ':memory:' );

database.exec( `
  CREATE TABLE tradesClosed(    
OpenPostionId, INTEGER PRIMARY KEY,
TradeDateClose,
TradeDateOpen,
AccountId,
AccountCurrency,
Assettype,
InstrumentDescription,
InstrumentSymbol,
Instrumentcurrency,
ClosePostionId,
QuantityClose,
QuantityOpen,
OpenPrice,                          
ClosePrice,
TotalBookedOnOpeningLegAccountCurrency,
TotalBookedOnOpeningLegClientCurrency,
TotalBookedOnClosingLegAccountCurrency,
ClientCurrency,
TotalBookedOnClosingLegClientCurrency,                                    	
PnLClientCurrency
  ) STRICT
`);
async function localFileAll( file ) {

  const fd = await fs.open( path.join( __dirname, file ), 'r' )
  
  const insert = database.prepare( 'INSERT INTO tradesClosed  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', ...array1 );

  for await ( const line of fd.readLines() ) {
    let array1 = line.toString().split( "\t" );
    insert.run(array1);
  }

}


// Create a prepared statement to read data from the database.
const query = database.prepare( 'SELECT * FROM tradesClosed ORDER BY OpenPositionId' );
// Execute the prepared statement and log the result set.
console.log( query.all() );
// Prints: [ { key: 1, value: 'hello' }, { key: 2, value: 'world' } ]