'use strict';

var fs = require('fs'),
  temp = require('temp'),
  closureLinterWrapper = require('closure-linter-wrapper'),
  View = require('./closure-linter-view');

temp.track();

var App = module.exports = {
  configDefaults: {
    autoFixOnSave: false
  },
  
  activate: function() {
    console.log('activate closure-linter');
    this.view = new View();
    atom.workspaceView.command('closure-linter:fixjsstyle', function() {
      // App.fixFileStyle();
      App.fixBufferStyle();
    });
    this.bindEvents();
  },

  bindEvents: function() {
    atom.config.observe('closure-linter.autoFixOnSave', function(autoFixOnSave) {
        App.autoFixOnSave = autoFixOnSave;
    });

    atom.workspaceView.eachEditorView(function(editorView) {
      var editor = editorView.editor,
        buffer = editor.getBuffer();

      if (App.autoFixOnSave) {
        editorView.subscribe(buffer.on('saved', function(buffer) {
          if (App.autoFixOnSave) {
            App.fixBufferStyle();
          }
        }));
      }
    });
  },

  getEditor: function() {
    return atom.workspace.activePaneItem;
  },

  getFilePath: function() {
    var editor = this.getEditor();
    if (editor.buffer.file) {
      return editor.buffer.file.path;
    }
  },

  restorePosition: function() {
    var editor = this.getEditor(),
      scrollTop = editor.getScrollTop(),
      cursorPosition = editor.getCursorBufferPosition();

    return function() {
      editor.setScrollTop(scrollTop);
      editor.setCursorBufferPosition(cursorPosition);
    };
  },

  fixBufferStyle: function() {
    var editor = this.getEditor(),
      suffix = editor.getGrammar().scopeName,
      filePath = this.getFilePath(),
      restorePosition = this.restorePosition();

    temp.open({suffix: suffix}, function(err, info) {
      fs.write(info.fd, editor.getText(), function() {
        fs.close(info.fd, function() {
          App.fixStyle(info.path, function(err, result) {
            fs.readFile(info.path, { encoding: 'utf-8' }, function(err, data) {
              var rTempPath = new RegExp(info.path, 'g');
              editor.setText(data);
              restorePosition();
              App.notice(result.replace(rTempPath, filePath));
            });
          });
        });
      });
    });
  },

  fixFileStyle: function() {
    this.fixStyle(this.getFilePath());
  },

  fixStyle: function(src, callback) {
    callback || (callback = (function(_this) {
      return function(err, result) {
        if (!err) {
          return _this.notice(result);
        }
      };
    })(this));

    closureLinterWrapper.fixjsstyle({
      flags: ['--nojsdoc'],
      src: [src],
      reporter: {}
    }, callback);
  },

  lint: function(src) {
    closureLinterWrapper.gjslint({
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
