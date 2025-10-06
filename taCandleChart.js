/*
mandatory pre statements:
zchart in the HMTL modther documement 
*/
function candleStickChart ( json ) {
  let T = JSON.parse( json );
  let S0;

  document.getElementById( "currentPrice" ).textContent = T[ T.length - 1 ].close;

  T.map( ( slot, ix ) => {
    document.getElementById( "zchart" ).appendChild( makeLine( slot ) );
    document.getElementById( "zcandle" ).appendChild( makeStick( slot ) );
  } );

  document.getElementById( "zcandle" ).addEventListener( "mousemove", where );
  document.getElementById( "zcandle" ).addEventListener( "mouseover", show );

  function makeStick ( S, S0 ) {

    let offsetInMinutes =
      new Date( S.timestamp * 1e3 ).getHours() * 60 +
      new Date( S.timestamp * 1e3 ).getMinutes();
    let twoDollar = parseInt( ( S.close - 2 ) ); // show only the tip of the column
    let aequator = 400;

    let g = document.createElementNS( "http://www.w3.org/2000/svg", "g" );

    g.setAttribute( "ztime", S.timestamp );
    g.setAttribute( "zclose", S.close );
    g.setAttribute( "zopen", S.open );
    g.setAttribute( "zhigh", S.high );
    g.setAttribute( "zvolume", S.volume );
    g.setAttribute( "zlow", S.low );

    let line = document.createElementNS( "http://www.w3.org/2000/svg", "line" );

    line.setAttribute( "x1", offsetInMinutes );
    line.setAttribute( "y1", aequator - ( ( S.low - twoDollar ) * 100 ) );
    line.setAttribute( "x2", offsetInMinutes );
    line.setAttribute( "y2", aequator - ( ( S.high - twoDollar ) * 100 ) );
    line.setAttribute( "stroke", "#625B71" );
    line.setAttribute( "stroke-width", 0.5 );

    g.appendChild( line );

    line = document.createElementNS( "http://www.w3.org/2000/svg", "line" );

    line.setAttribute( "x1", offsetInMinutes );
    line.setAttribute( "y1", aequator - ( ( S.open - twoDollar ) * 1e2 ) );
    line.setAttribute( "x2", offsetInMinutes );
    line.setAttribute( "y2", aequator - ( ( S.close - twoDollar ) * 1e2 ) );
    line.setAttribute( "stroke", redGreen( S ) );
    line.setAttribute( "stroke-linecap", "round" );
    line.setAttribute( "stroke-width", 4 );

    g.appendChild( line );

    let circle = document.createElementNS( "http://www.w3.org/2000/svg", "circle" );

    circle.setAttribute( "cx", offsetInMinutes );
    circle.setAttribute( "cy", 400 - ( ( S.close - twoDollar ) * 100 ) );
    circle.setAttribute( "r", 2 );
    circle.setAttribute( "stroke", "none" );
    circle.setAttribute( "fill", "#fff" );

    g.appendChild( circle );

    return g;
  }
  function redGreen ( S ) {

    return ( S.open < S.close ) ? "#ff3088" : "#2fff00";
  }
  function makeLine ( S ) {

    let minutes =
      new Date( S.timestamp * 1e3 ).getHours() * 60 +
      new Date( S.timestamp * 1e3 ).getMinutes();

    let A = polarToCartesian( 180, 180, 150 + ( ( S.high - S.close ) * 20 ), minutes / 2 );
    let B = polarToCartesian( 180, 180, 150 - ( ( S.close - S.low ) * 20 ), minutes / 2 );

    let line = document.createElementNS( "http://www.w3.org/2000/svg", "line" );

    line.setAttribute( "x1", A.x );
    line.setAttribute( "y1", A.y );
    line.setAttribute( "x2", B.x );
    line.setAttribute( "y2", B.y );
    line.setAttribute( "ztime", S.timestamp );
    line.setAttribute( "zclose", S.close );
    line.setAttribute( "zopen", S.open );
    line.setAttribute( "zhigh", S.high );
    line.setAttribute( "zvolume", S.volume );
    line.setAttribute( "zlow", S.low );
    line.setAttribute( "stroke", "#fff" );
    line.setAttribute( "stroke-width", 3 );

    return line;

    function polarToCartesian ( centerX, centerY, radius, angleInDegrees ) {
      let angleInRadians = ( ( angleInDegrees - 90 ) * Math.PI ) / 180.0;

      return {
        x: centerX + radius * Math.cos( angleInRadians ),
        y: centerY + radius * Math.sin( angleInRadians ),
      };
    }
  }
  document.getElementById( "zchart" ).addEventListener( "mouseover", show );
  document.getElementById( "zchart" ).addEventListener( "mousemove", where );
  }