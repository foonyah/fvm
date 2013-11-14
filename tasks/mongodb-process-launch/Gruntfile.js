/***/
var path = require('path'), fs = require('fs'), _ = require('grunt-runner')._;
var taskname = _.taskname(__dirname); // mongodb-process-launch

module.exports = function(grunt) {

  var tmes = 'Starting mongodb.';
  var conf = _.mixedConfigure(grunt, taskname);

  var trunk = {};
  trunk[conf.rootdir] = [], [].concat(conf.mongod || [], conf.mongos || [],
    conf.mongoc || []).forEach(function(stat) {
    trunk[conf.rootdir].push(stat.data);
  });

  grunt.config.set('tree-prepare', {
    options: {},
    tree: trunk
  });

  // create root directory
  grunt.loadNpmTasks('grunt-tree-prepare');

  // main process
  var task_main = taskname + '.main';
  grunt.registerTask(task_main, tmes, _.caught(function() {
    mongodbPLaunch(grunt, this, conf);
  }, grunt.fail));

  // to be called
  grunt.registerTask(taskname, tmes, ['tree-prepare', task_main]);

};
function mongodbPLaunch(grunt, gtask, conf) {

  var mongo = path.join(_.pwd, conf.rootdir, conf.simbolicLinkTo, 'bin/mongo');
  var line = [], done = gtask.async(), stop = function(e) {
    grunt.fail.fatal(e);
  }, log = function(m) {
    _.util.log('[' + gtask.name + '] ' + m);
  };

  // cd database root
  line.push(function() {
    process.chdir(conf.rootdir), _.next(arguments)();
  });

  var opts = conf.options;
  Array.isArray(conf.mongod) && conf.mongod.forEach(function(stat) {

    var ch_opts = stat.options;

    line.push(function(next) {
      var cmd = [mongo + 'd', '--port=' + stat.port, '--dbpath=' + stat.data];
      ch_opts && cmd.push(ch_opts), opts && cmd.push(opts);
      require('child_process').exec(cmd.join(' '), function(error, sout, serr) {
        console.log(error, sout, serr);
      }).on('exit', function() {
        next();
      });
    })

    line.push(function(next) {
      // TODO check
      next();
    });

  });

  //revert process position
  line.push(function(next) {
    process.chdir(_.pwd), _.next(arguments)();
  });

  line.push(function() {
    log('done.'), done();
  });

  _.micropipe(line);

}
