async function symbolData ( zcode = 'JPY=X' ) {

  const axios = require( 'axios' );

  let allInOne = {};

  const options = {

    params: {
      interval: '60m',
      symbol: zcode,
      region: 'US',
      range: '5d',
      includePrePost: 'false',
      useYfid: 'false',
      includeAdjustedClose: 'false',
      events: 'capitalGain,div,split',
    },
    headers: {
      'x-rapidapi-key': process.env.YAHOO,
      'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
    }
  };

  try {

    const nasdaq = await axios.get( 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v3/get-chart', options );

    allInOne.currency = nasdaq.data.chart.result[ 0 ].meta.currency;
    allInOne.symbol = nasdaq.data.chart.result[ 0 ].meta.symbol;
    allInOne.regularMarketPrice = nasdaq.data.chart.result[ 0 ].meta.regularMarketPrice;

    let collection = [];
    /* each of these dat columns is separate, therefore we use timestamp as driver for the rest */
    nasdaq.data.chart.result[ 0 ].timestamp.map( ( T, ix ) => {
      let slot = {};
      slot.timestamp = T;
      slot.dateISO = new Date( slot.timestamp * 1e3 ).toISOString();
      slot.close = nasdaq.data.chart.result[ 0 ].indicators?.quote[ 0 ].close[ ix ];
      slot.volume = nasdaq.data.chart.result[ 0 ].indicators?.quote[ 0 ].volume[ ix ];
      slot.low = nasdaq.data.chart.result[ 0 ].indicators?.quote[ 0 ].low[ ix ];
      slot.high = nasdaq.data.chart.result[ 0 ].indicators?.quote[ 0 ].high[ ix ];
      slot.open = nasdaq.data.chart.result[ 0 ].indicators?.quote[ 0 ].open[ ix ];

      collection.push( slot );
    } );

    allInOne.collection = collection;

    return allInOne;
  }
  catch ( whatIsWrong ) {
    console.log( " hmmm, errors  " + new Date().toISOString() + " " + whatIsWrong );
  }
  finally {
    console.log( "taSymbolPeriod  " + new Date().toISOString() + " return data on " + zcode + " " + zp1 + " " + zp2 );
  }
}
module.exports = symbolData;