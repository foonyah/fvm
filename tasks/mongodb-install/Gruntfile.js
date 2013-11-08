/***/
var path = require('path'), fs = require('fs'), _ = require('grun')._;
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

  line.push(function() {
    // create file
    var next = _.next(arguments);
    fs.open(afp, 'w', function(err, fd) {
      err ? stop(err): next(fd);
    });
  });

  line.push(function(fd, next) {
    // download mongodb
    require('http').get(mongoArchiveURL(), function(res) {
      var len = 0;
      var bytes = _.thousandSep(res.headers['content-length']) + ' bytes';
      log('Downloading mongodb archive... (' + bytes + ')');
      res.on('data', function(d) {
        fs.write(fd, d, 0, d.length, len), len += d.length;
      }).on('end', function() {
        next(fd);
      });
    });
  });

  line.push(function(fd, next) {
    fs.close(fd, function(err) {
      err ? stop(err): next();
    });
  });

  line.push(function(next) {
    // decompress
    require('child_process').exec(_.decompress(afp)).on('exit', function(code) {
      log('Decompress mongodb archive finished.');
      next();
    });
  });

  line.push(function(next) {
    // remove sinbolic link if exist
    fs.unlink(conf.simbolicLinkTo, function(err) {
      next();
    })
  });

  line.push(function(next) {
    // add sinbolic link
    require('child_process').exec(
      _.simbolicLink(mongoArchive(), conf.simbolicLinkTo)).on('exit', onExit);
    function onExit(code) {
      log('Create simbolic link "' + conf.simbolicLinkTo + '" finished.');
      next();
    }
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
