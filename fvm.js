/***/
var pwd = process.cwd(), tasks = [];
console.log(pwd);

var assert = require('assert'), path = require('path'), fs = require('fs');
var argv = require('named-argv'), micropipe = require('micro-pipe');
var platform = require('os').platform;

var Mongo = {
  Dist: 'http://fastdl.mongodb.org/',
  Cver: '2.4.8'
};

var mem = null;
tasks.push(function(next) {
  // open archive file
  mem = path.join(pwd, 'mongodb' + ext());
  fs.open(mem, next)

}, function(err, fd, next) {
  // download mongodb
  require('http').get(mongoArchive(), function(err, res) {
    res.on('data', function(d) {
      fd.write(d);
    }).on('end', function() {
      fd.close(next);
    });
  });

}, function(err, next) {
  // decompress
  require('child_process').exec(decompress(mem)).on('exit', next)

}, function() {
  // mkdir "foonyah", "foonyah-plugins"
  ['node_modules/foonyah', 'node_modules/foonyah-plugins'].forEach(function(f) {
    var d = path.resolve('./' + f);
    try {
      if(!fs.statSync(d).isDirectory())
        throw 'mkdir';
    } catch(e) {
      fs.mkdirSync(d);
    }
  });

});

micropipe(tasks.concat(function() {
  process.exit(0);
}))

function mongoArchive() {
  return Mongo.Dist + (function() {
    if(platform === 'win32')
      return 'win32/mongodb-win32-x86_64-2008plus-' + Mongo.Cver + '.zip';
    if(platform === 'darwin')
      return 'osx/mongodb-osx-x86_64-' + Mongo.Cver + '.tgz';
    if(platform === 'sunos')
      return 'sunos5/mongodb-sunos5-x86_64-' + Mongo.Cver + '.tgz';
    return 'linux/mongodb-linux-x86_64-' + Mongo.Cver + '.tgz';
  })();
}

function ext() {
  return platform === 'win32' ? '.zip': '.tgz';
}

function decompress(f) {
  return (ext() == '.tgz' ? 'tar -zxvf': 'unzip') + ' ' + f;
}
