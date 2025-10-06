
async function getList( filter ) {


  const buffer = await fetch( '/tsv/taCorpEthics' );

  const resp = await buffer.text();

  const GROUP_KEY = 8;

  let tsvA = new TabSeparatedValuesIntoArray( resp, GROUP_KEY, filter, [ 6, 1, 12, 13, 14, 17, 18, 16 ] );

  //document.getElementById( 'a1' ).appendChild( tsvA.tsvCR( [ 1, 2, 5, 6, 8, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21 ] ) );
  //document.getElementById( 'a1' ).appendChild( tsvA.tsvCR( [ 6, 1, 2, 5, 8, 11, 12, 13, 14, 17, 18, 16, 19, 20] ) );
  // document.getElementById( 'a1' ).appendChild( tsvA.tsvSumma( 20 ) );


  document.getElementById( 'b1' ).innerHTML = tsvA.tsv2fixed();


}
async function IBM() {

  const buffer = await fetch( '/IBM/Manuals' );

  const tsv = await buffer.text();

  localStorage.setItem( "original", tsv )

  const GROUP_KEY = 1;

  let tsvA = new TabSeparatedValuesIntoArray( tsv, GROUP_KEY );

  a1.appendChild( tsvA.tsvRC() );
}


async function JPY() {

  const buffer = await fetch( '/SYMBOLS' );

  const tsv = await buffer.text();

  const All = JSON.parse( tsv );

  let tsvA = new TabSeparatedValuesIntoArray( tsv, GROUP_KEY );

  document.getElementById( 'a1' ).appendChild( tsvA.tsvRC() );
}


function post() {
  /*
  *  loop thru table rows, then cells th, td
  *  using same sequence as tab separated values when created
  */
  let tsv = []
  var tr_rows = document.querySelectorAll( 'tr' );
  for ( elements of tr_rows ) {
    let td_th_cells = elements.children
    let line = []
    for ( element of td_th_cells ) {
      line.push( element.textContent )
    }
    tsv.push( line.join( '\t' ) )
  }

  localStorage.setItem( "tsv", tsv.join( '\r\n' ) )
}

a1.addEventListener( ( 'blur' ), function ( event ) { post() } )
// getList(new URL(window.location.href).searchParams.get('filter'));
document.cookie = "username=JohnDoe; expires=Thu, 31 Dec 2029 23:59:59 GMT; path=/";
getList();
