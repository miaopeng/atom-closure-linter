var View, fixjsstyle, gjslint, _, _ref;

_ = require('underscore');

_ref = require("closure-linter-wrapper"), gjslint = _ref.gjslint, fixjsstyle = _ref.fixjsstyle;

View = require("./closure-linter-view");

module.exports = {
  activate: function() {
    this.view = new View();
    return atom.workspaceView.command("closure-linter:fixjsstyle", (function(_this) {
      return function() {
        return _this.fixFileStyle();
      };
    })(this));
  },
  fixFileStyle: function() {
    var editor, file, src;
    editor = atom.workspace.activePaneItem;
    file = editor != null ? editor.buffer.file : void 0;
    src = file != null ? file.path : void 0;
    return this.fixStyle(src);
  },
  fixStyle: function(src, callback) {
    callback || (callback = (function(_this) {
      return function(err, result) {
        if (!err) {
          return _this.notice(result);
        }
      };
    })(this));
    return fixjsstyle({
      flags: ['--nojsdoc'],
      src: [src],
      reporter: {}
    }, callback);
  },
  lint: function(src) {
    return gjslint({
      flags: ['--nojsdoc'],
      src: [src],
      reporter: {
        name: 'console'
      }
    }, function(err, result) {
      if (!err) {
        return console.log('Everything went fine');
      }
    });
  },
  notice: function(message) {
    if (this.view) {
      this.view.message({
        message: message
      });
      return this.view.notice();
    }
  }
};
