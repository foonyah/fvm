/***/
// foonyah-install
var _ = require('grunt-runner')._, taskname = _.taskname(__dirname);
module.exports = function(grunt) {

  var taskmess = 'Prepare directories for foonyah...';
  grunt.config.set('tree-prepare', {
    options: {},
    tree: {
      '.fvm': ['foonyah']
    }
  });

  grunt.loadNpmTasks('grunt-tree-prepare');
  grunt.registerTask(taskname, taskmess, ['tree-prepare']);

};
