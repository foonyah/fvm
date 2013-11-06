/***/
var assert = require('assert'), path = require('path'), fs = require('fs');
var action = null, modules = null, key = null, opts = {};

// analyze arguments
process.argv.slice(2).forEach(function(v) {

  v = v.trim();
  if(action == null)
    return action = v;
  if(modules == null)
    return modules = v.split(',');

  if(!v)
    return;

  if(v.charAt(0) == '-') {

    while(v.charAt(0) == '-')
      v = v.substr(1);

    if(key)
      opts[key] = true, key = null;

    var idx = v.indexOf('=');
    key = v.substring(0, idx < 0 ? v.length: idx), key != v && (function() {
      opts[key] = v.substr(idx + 1), key = null;
    })();
    return;

  }

  if(key) {
    opts[key] = v, key = null;
    return;
  }

  // ignore

}), key && (opts[key] = true);

console.log(process.cwd())
console.log(action, modules, opts);

// seek node_modules
var origin_a = process.cwd().split('/');
var path_to = null;
while(origin_a.length && path_to == null) {
  var path_test = path.join(origin_a.join('/'), 'node_modules');
  try {
    if(fs.statSync(path_test).isDirectory())
      path_to = path_test;
  } catch(e) {
  }
  origin_a.pop();
}

// mkdir if not found
if(path_to == null) {
  path_to = path.join(process.cwd(), 'node_modules');
  fs.mkdirSync(path_to);
}

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
