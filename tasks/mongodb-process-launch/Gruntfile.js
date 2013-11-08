/***/
var path = require('path'), fs = require('fs'), _ = require('grunt-runner')._;
var taskname = __dirname.split('/').pop(); // mongodb-process-launch

module.exports = function(grunt) {
  var tmes = 'Starting mongodb.';
  grunt.registerTask(taskname, tmes, _.caught(function() {
    mongodbPLaunch(grunt, _.mixedConfigure(grunt, taskname), this);
  }, grunt.fail));
};
function mongodbPLaunch(grunt, conf, gtask) {

  var mongo = path.join(_.pwd, conf.simbolicLinkTo, 'bin/mongo');
  var line = [], done = gtask.async(), stop = function(e) {
    grunt.fail.fatal(e);
  }, log = function(m) {
    _.util.log('[' + gtask.name + '] ' + m);
  };

  var opts = conf.options;
  Array.isArray(conf.mongod) && conf.mongod.forEach(function(stat) {

    var ch_opts = stat.options, d_dira = stat.data.split('/'), d_dir = '';
    while(d_dira.length)
      (function(t_dir) {
        line.push(function(next) {
          _.mkdir(path.join(_.pwd, t_dir), function(err) {
            err ? stop(err): next();
          });
        });
      })(d_dir += (d_dir ? '/': '') + d_dira.shift());

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

  line.push(function() {
    log('done.'), done();
  });

  _.micropipe(line);

}
