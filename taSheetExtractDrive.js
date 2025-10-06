import { promises as fs } from 'fs';
import { join } from 'path';
import { cwd } from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import { createWriteStream } from 'node:fs';

// If modifying these scopes, delete token.json.
const SCOPES = [ 'https://www.googleapis.com/auth/drive' ];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = join( cwd(), 'token.json' );
const CREDENTIALS_PATH = join( cwd(), 'oauth2.keys.json' );

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile( TOKEN_PATH );
    const credentials = JSON.parse( content );
    return google.auth.fromJSON( credentials );
  } catch ( err ) {
    return null;
  }
}

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials( client ) {
  const content = await fs.readFile( CREDENTIALS_PATH );
  const keys = JSON.parse( content );
  const key = keys.installed || keys.web;
  const payload = JSON.stringify( {
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  } );
  await fs.writeFile( TOKEN_PATH, payload );
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {

  let client = await loadSavedCredentialsIfExist();

  if ( client ) { return client; }

  client = await authenticate( {
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  } );
  if ( client.credentials ) { await saveCredentials( client ); }

  return client;
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 */
async function listFiles( authClient ) {

  const drive = google.drive( { version: 'v3', auth: authClient } );

  const temp = await drive.files.list( {
    pageSize: 99,
    fields: 'nextPageToken, files(id, name, fileExtension, size)',
  } );

  const files = temp.data.files;

  if ( files.length === 0 ) {
    log( 'No files found.' );
    return;
  }

  //let dest = fsx.createWriteStream( 'output/' + files[1].name );

  console.log( 'Files:' );
  console.table( files );

  let jobs = [];

  files.forEach( ( file, ix ) => {
    if ( file.fileExtension === 'xlsx' ) jobs.push( file );
  } )

  serialize( jobs.shift() );

/**
 * look for sheets extension - extract and put them in sheet folder
 * @param job which is the filename. Job is a term to serialize
 */
  async function serialize( job ) {

    var dest = createWriteStream( 'sheets/' + job.name );
    let temp = await drive.files.get( { fileId: job.id, alt: 'media' }, { responseType: 'stream' } );
    temp.data.pipe( dest );

    if ( jobs.length > 0 ) serialize( jobs.shift() );

  }
}

function log( what ) {

  _stdout.write( 'taSheetExtractDrive ' + new Date().toISOString() + ' ' + JSON.stringify( what ) + '\r\n' );

  return;
}
authorize().then( listFiles ).catch( console.error );