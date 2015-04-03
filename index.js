#!/usr/bin/env node
'use strict';

var fgdb = require('fgdb')
, fs = require('fs')
, path = require('path')
, jf = require('jsonfile')
// , jsonminify = require("./node_modules/jsonminify/minify.json.js")
// , util = require('util')
, ArgumentParser = require('argparse').ArgumentParser
, parser = new ArgumentParser({
  version: '0.0.1',
  addHelp:true,
  description: 'FileGDB to geojson'
});


parser.addArgument(
  [ '-i', '--input' ],
  {
    help: 'input FileGDB'
  }
);

parser.addArgument(
  [ '-o', '--output' ],
  {
    help: 'output geojson'
  }
);

// parser.addArgument(
//   [ '-min', '--minify' ],
//   {
//     action: 'storeTrue', 
//     help: 'minify?'
//   }
// );

var args = parser.parseArgs()
, input = args.input
, output = args.output
// , minify = args.minify
;

if(!input || !output){
	console.log( new Error('Need to specify input and output') );
	process.exit(1);
}

var resolvedinput = path.resolve(input)
, resolvedoutput = path.resolve(output);

if( !fs.existsSync(resolvedinput)){
	console.log( new Error('Input path ' + input + ' does not exist') );
	process.exit(1);
}

if( !fs.existsSync( path.dirname(resolvedoutput) ) ){
	console.log( new Error('Output directory ' + path.dirname(resolvedoutput) + ' does not exist') );
	process.exit(1);
}
// console.dir(args);
console.log('converting', resolvedinput, 'to', output)
// console.log('converting', input, 'to', output)

fgdb( resolvedinput ).then(function(json){
  // // json = JSON.parse(json);
  // // console.log('looks like the number of features in this doc is: ', json.features && json.features.length)
  // if(minify){
  //   console.log('minifying')
  //   json = JSON.minify( json );
  //   // json = JSON.parse( jsonminify( json ) );
  // }

	jf.writeFile(resolvedoutput, json, function(err) {
  		if(err){
			 console.log( 'error:', err );
			 return process.exit(1);
  		}
  		console.log('Success!')
	})
},function(error){
	console.log( new Error('Error converting ' + [input, output].join(' to ') ) );
	process.exit(1);
});
