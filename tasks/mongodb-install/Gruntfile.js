/***/
var path = require('path'), fs = require('fs'), _ = require('grunt-runner')._;
var taskname = __dirname.split('/').pop(); // mongodb-install

module.exports = function(grunt) {
  var tmes = 'Download archive and install mongodb.';
  grunt.registerTask(taskname, tmes, _.caught(function() {
    mongodbInstall(grunt, _.mixedConfigure(grunt, taskname), this);
  }, grunt.fail));
};
function mongodbInstall(grunt, conf, gtask) {

  var afp = path.join(_.pwd, 'mongodb' + _.archiveExt());
  var line = [], done = gtask.async(), stop = function(e) {
    grunt.fail.fatal(e);
  }, log = function(m) {
    _.util.log('[' + gtask.name + '] ' + m);
  };

  // download mongodb
  line.push(function(next) {
    _.download(mongoArchiveURL(), afp).on('message', log).on('error', stop).on(
      'end', next);
  });

  //decompress
  line.push(function(next) {
    _.decompress(afp).on('message', log).on('error', stop).on('end', next);
  });

  // add symbolic link
  line.push(function(next) {
    _.symlinkd(mongoArchive(), conf.simbolicLinkTo).on('message', log).on(
      'error', stop).on('end', next);
  });

  line.push(function() {
    log('done.'), done();
  });

  _.micropipe(line);

  function mongoArchiveURL() {
    return conf.dist + mongoArchive(true, true);
  }

  function mongoArchive(with_dir, with_ext) {
    var dir = function(t) {
      return with_dir ? t + '/': '';
    }
    var ext = function() {
      return with_ext ? _.archiveExt(): '';
    }
    if(_.platform === 'win32')
      return dir('win32') + 'mongodb-win32-x86_64-2008plus-' + conf.version
        + ext();
    if(_.platform === 'darwin')
      return dir('osx') + 'mongodb-osx-x86_64-' + conf.version + ext();
    if(_.platform === 'sunos')
      return dir('sunos5') + 'mongodb-sunos5-x86_64-' + conf.version + ext();
    if(true)
      return dir('linux') + 'mongodb-linux-x86_64-' + conf.version + ext();
  }

}
