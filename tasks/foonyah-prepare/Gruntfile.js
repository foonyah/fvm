/***/
var path = require('path'), fs = require('fs'), _ = require('grunt-runner')._;
var taskname = __dirname.split('/').pop(); // foonyah-prepare

module.exports = function(grunt) {
  var tmes = 'Prepare directories for foonyah.';
  grunt.registerTask(taskname, tmes, _.caught(function() {
    foonyahPrepare(grunt, _.mixedConfigure(grunt, taskname), this);
  }, grunt.fail));
};
function foonyahPrepare(grunt, conf, gtask) {

  var line = [], done = gtask.async(), stop = function(e) {
    grunt.fail.fatal(e);
  }, log = function(m) {
    _.util.log('[' + gtask.name + '] ' + m);
  };

  //mkdir "foonyah", "foonyah-plugins"
  ['node_modules/foonyah', 'node_modules/foonyah-plugins'].forEach(function(f) {
    var d = path.resolve('./' + f);
    line.push(function() {
      _.mkdir(d, _.next(arguments));
    });
  });

  line.push(function() {
    log('done.'), done();
  });

  _.micropipe(line);

}
