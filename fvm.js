/***/
var fs = require('fs'), path = require('path');
var argv = require('named-argv'), grunt = require('grunt');
grunt.initConfig({
  pkg: grunt.file.readJSON(argv.opts.config || 'package.json'),
});

var taskr = 'tasks';

fs.readdir(taskr, function(err, files) {
  files.forEach(function(taskd) {
    taskd = './' + taskr + '/' + taskd;
    fs.statSync(taskd).isDirectory() && grunt.loadTasks(taskd);
  });
  grunt.task.run(grunt.config.get('pkg').taskList);
  grunt.task.start();
});

/*
// mkdir "foonyah", "foonyah-plugins"
['node_modules/foonyah', 'node_modules/foonyah-plugins'].forEach(function(f) {
  var d = path.resolve('./' + f);
  tasks.push(function(err, next) {
    try {
      console.log(d);
      console.log(fs.statSync(d).isDirectory())
      if(!fs.statSync(d).isDirectory())
        throw 'mkdir';
      next();
    } catch(e) {
      fs.mkdir(d, next);
    }
  });

});

micropipe(tasks.concat(function() {
  process.exit(0);
}))
*/
