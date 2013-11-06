/***/
var assert = require('assert'), path = require('path'), fs = require('fs');
var argv = require('named-argv');

// mkdir "foonyah", "foonyah-plugins"
['foonyah', 'foonyah-plugins'].forEach(function(f) {
  var d = path.join(path_to, f);
  try {
    if(!fs.statSync(d).isDirectory())
      throw 'mkdir';
  } catch(e) {
    fs.mkdirSync(d);
  }
});
console.log(path_to);
