/***/
// mongodb-install
var path = require('path'), fs = require('fs'), grun = require('grunt-runner');
var _ = grun._, taskname = _.taskname(__dirname);

module.exports = function(grunt) {

  var tmes = 'Download archive and install mongodb.';
  var conf = _.mixedConfigure(grunt, taskname);

  grunt.config.set('tree-prepare', {
    options: {},
    tree: {
      '.': [conf.rootdir]
    }
  });

  // create root directory
  grunt.loadNpmTasks('grunt-tree-prepare');

  // main process
  var task_main = taskname + '.main';
  grunt.registerTask(task_main, tmes, _.caught(function() {
    mongodbInstall(grunt, this, conf);
  }, grunt.fail));

  // to be called
  grunt.registerTask(taskname, tmes, ['tree-prepare', task_main]);

};

function mongodbInstall(grunt, gtask, conf) {

  var afp = path.join(_.pwd, conf.rootdir, 'mongodb' + _.archiveExt());
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

  // cd database root
  line.push(function() {
    process.chdir(conf.rootdir), _.next(arguments)();
  });

  //decompress
  line.push(function(next) {
    _.decompress(afp).on('message', log).on('error', stop).on('end', next);
  });

  // add symbolic link
  line.push(function(next) {
    _.symlinkd(mongoArchive(), path.join(conf.simbolicLinkTo)).on('message',
      log).on('error', stop).on('end', next);
  });

  //revert process position
  line.push(function(next) {
    process.chdir(_.pwd), _.next(arguments)();
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
