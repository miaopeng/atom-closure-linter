var ClosureLinter, UglifyJS, WorkspaceView, fs, path;

fs = require('fs');

path = require('path');

UglifyJS = require('uglify-js');

WorkspaceView = require('atom').WorkspaceView;

ClosureLinter = require('../lib/closure-linter');

describe("ClosureLinter", function() {
  var activationPromise, filePath;
  activationPromise = null;
  filePath = path.join(__dirname, 'fixture', 'ugly.js');
  console.log('filepath', filePath);
  beforeEach(function() {
    atom.workspaceView = new WorkspaceView;
    return activationPromise = atom.packages.activatePackage('closure-linter');
  });
  afterEach(function() {
    var source;
    source = UglifyJS.minify(filePath);
    return fs.writeFileSync(filePath, source.code);
  });
  return describe("when the closure-linter:fixjsstyle event is triggered", function() {
    return it("fix code styles for javascript file", function() {
      var flag;
      flag = false;
      runs(function() {
        return ClosureLinter.fixStyle(filePath, function() {
          var source;
          source = fs.readFileSync(filePath);
          expect(source.length).toBe(9);
          return flag = true;
        });
      });
      return waitsFor(function() {
        return flag;
      }, 'code style fixed');
    });
  });
});
