class TabSeparatedValuesIntoArray {
  constructor( tsvRaw, primeColumn, filter = null, Columns = null, summaColumn = 1 ) {
    this.filter = filter;
    this.Columns = Columns;
    this.boilerPlate = "TabSeparatedValuesIntoArray";
    this.tsvRaw = tsvRaw.split( "\x0D\x0A" );
    this.groupColumn = primeColumn;
    this.offset = summaColumn;
    this.tsvSorted = [];
    this.tsvSortedSplit = [];
    this.stat = {
      zmax: Number.MIN_SAFE_INTEGER,
      zmin: Number.MAX_SAFE_INTEGER,
      columns: 0,
      rows: 0,
      wordMin: "\x7E",
      wordMax: "\xFF",
    };

    let raw = this.tsvRaw;
    let names = raw.shift(); // do not sort heading names

    this.tsvSorted = raw.sort( ( a, b ) => {
      let current = a.split( "\x09" )[ this.groupColumn ];
      let previous = b.split( "\x09" )[ this.groupColumn ];
      if ( current > previous ) return 1;
      if ( current < previous ) return -1;
      return 0;
    } );

//    this.tsvSorted.unshift( names ); // reenstate headline in sorted array

    let line = names;

    this.tsvSortedSplit.push( this.filterColumns( line ) );

    while ( this.tsvSorted.length > 0 ) {
      line = this.tsvSorted.shift();
      if ( this.filter ) {
        if ( line.indexOf( this.filter ) < 0 ) continue;
      }
      // this.tsvSortedSplit.push( line.split( "\x09" ) );
      this.tsvSortedSplit.push( this.filterColumns( line ) );
    }

    this.stat.columns = line.split( "\x09" ).length;
    this.stat.rows = this.tsvSortedSplit.length + 1;
    

    this.what( "Succesfully transform " );
    console.table(this.stat);
  }
  filterColumns ( columnsLine ) {
    let temp = columnsLine.split( "\x09" );

    if ( this.filter === null ) return temp;

    let filteredElements = [];

    for ( let col = 0; col < this.Columns.length; col++ ) {
      filteredElements.push( temp[ this.Columns[ col ] ] );
    }
    return filteredElements;

  }
  what ( arg ) {
    console.log( this.boilerPlate + " " + new Date().toISOString() + " " + arg );
  }
  giveMeData () {
    return this.tsvSortedSplit;
  }
  passBackInitial () {
    return this.tsvRaw;
  }

  tsvCR ( columns = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ] ) {
    let tsvRows = this.tsvSortedSplit;
    let SHEET = document.createElement( "table" );
    let Tx;

    while ( columns.length > 0 ) {

      let col = columns.shift();

      let TR = document.createElement( "tr" );

      for ( let row = 0; row < tsvRows.length; row++ ) {
        if ( row === 0 ) {
          Tx = document.createElement( "th" );
        } else if ( parseInt( tsvRows[ row ][ col ] ) ) {
          Tx = document.createElement( "th" );
        } else {
          Tx = document.createElement( "td" );
        }
        Tx.textContent = tsvRows[ row ][ col ];
        TR.appendChild( Tx );
      }
      SHEET.appendChild( TR );
    }

    this.what( "columns and rows table hmtl wrapped " );
    return SHEET;
  }

  tsvRC () {
    let tsvRows = this.tsvSortedSplit;
    let SHEET = document.createElement( "table" );
    let occilate = "th";

    for ( let row = 0; row < tsvRows.length; row++ ) {
      let TR = document.createElement( "tr" );

      for ( let col = 0; col < tsvRows[ row ].length; col++ ) {
        if ( row === 0 ) occilate = "th";
        else if ( parseInt( tsvRows[ row ][ col ] ) ) occilate = "th";
        else occilate = "td";
        let Tx = document.createElement( occilate );
        Tx.textContent = tsvRows[ row ][ col ];
        Tx.setAttribute('contenteditable', true);
        TR.appendChild( Tx );
      }

      occilate = "td";
      SHEET.appendChild( TR );
    }

    this.what( "tsvRC html wrapped " );
    return SHEET;
  }

  tsvSumma ( summaColumn ) {

    let C = 0;
    let D = 0;
    let old = this.tsvSortedSplit[ 1 ][ this.groupColumn ];

    for ( let row = 1; row < this.tsvSortedSplit.length; row++ ) {
      if ( this.tsvSortedSplit[ row ][ this.groupColumn ] === old ) {
        C = C + parseInt( this.tsvSortedSplit[ row ][ summaColumn ] );
        D++;
      } else {
        this.tsvSortedSplit[ row - 1 ].push( C );
        this.tsvSortedSplit[ row - 1 ].push( D );
        old = this.tsvSortedSplit[ row ][ this.groupColumn ];
        C = parseInt( this.tsvSortedSplit[ row ][ summaColumn ] );
        D = 1;
      }
    }
    this.tsvSortedSplit[ this.tsvSortedSplit.length - 1 ].push( C );
    this.tsvSortedSplit[ this.tsvSortedSplit.length - 1 ].push( D );
    this.what( "summa Tx added" );
    return ( this.tsvRC() );
  }

  tsv2fixed () {

    let tsvRows = this.tsvSortedSplit;
    let A = [];
    let B = '';
    let C = '';

    let E = '';

    for ( let col = 0; col < tsvRows[ 0 ].length; col++ ) {
      let old = 0;
      for ( let row = 0; row < tsvRows.length - 1; row++ ) {
        if ( tsvRows[ row ][ col ].length > old ) {
          A[ col ] = {
            col: col,
            length: tsvRows[ row ][ col ].length,
          };
          old = tsvRows[ row ][ col ].length;
        }
      }
    }


    A.forEach( ( attr ) => { E = E + '\u2500'.repeat( ( attr.length + 3 ) ) + '\u253C'; } );

    E = `${E}\x0D\x0A`;
    B = E;

    for ( let row = 0; row < tsvRows.length; row++ ) {

      for ( let col = 0; col < tsvRows[ 0 ].length; col++ ) {
        
        let spaces = A[ col ].length + 2 - tsvRows[ row ][ col ].length;

        if ( parseInt( tsvRows[ row ][ col ] ) ) {
          tsvRows[ row ][ col ] = " ".repeat( spaces ) + tsvRows[ row ][ col ] + " ";
        } else tsvRows[ row ][ col ] = " " + tsvRows[ row ][ col ] + " ".repeat( spaces );
      }


      if ( row > 0 ) {
        if ( tsvRows[ row ][ this.groupColumn ] === tsvRows[ row - 1 ][ this.groupColumn ] === false ) B = B + E;
      }

      C = tsvRows[ row ].join( '\u2502' );
      B = `${B}${C}\u2502\x0D\x0A`;
    }

    this.what( "fixed length column " );

    return B;
  }
}


module.exports = TabSeparatedValuesIntoArray;