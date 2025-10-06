module.exports = function ( I, O ) {

  const { Storage } = require( "@google-cloud/storage" );
  const GS = new Storage();
  var csv = GS.bucket( "triticum" ).file( "CSV/" + I.body.what );
  var aggregate = csv.createReadStream();
  var data = [];

  aggregate
    .on( "error", ( E ) => { throw E; } )
    .on( "data", ( fragment ) => { data.push( fragment ); } )
    .on( "end", () => { collectHTML( Buffer.concat( data ).toString( 'utf8' ) ); } );

  function collectHTML ( csv ) {

    var invoiceLines = csv.split( ";" );
    var template = GS.bucket( "triticum" ).file( "CMS/invoiceTemplateLines" + invoiceLines.length + ".html" );
    var aggregate = template.createReadStream();
    var data = [];

    aggregate
      .on( "error", ( E ) => { throw E; } )
      .on( "data", ( fragment ) => { data.push( fragment ); } )
      .on( "end", () => {

        var ix = 0, jx = 0, concat = "", t = Buffer.concat( data ).toString( "utf8" ).split( "Ø" );

        for ( ix = 0; ix < invoiceLines.length; ix++ ) {
          concat = concat + t[ jx ] + invoiceLines[ ix ];
          jx = jx + 2;
        }

        O.set( "Content-Type", "text/html; charset=UTF-8" );
        O.send( ( concat + t[ jx ] ) );
      } );
  }

};