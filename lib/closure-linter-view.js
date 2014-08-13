var ClosureLinterView, KEYCODE_ESC, NO_MESSAGE, View,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

View = require('atom').View;

NO_MESSAGE = 'no errors found';

KEYCODE_ESC = 27;

module.exports = ClosureLinterView = (function(_super) {
  __extends(ClosureLinterView, _super);

  function ClosureLinterView() {
    return ClosureLinterView.__super__.constructor.apply(this, arguments);
  }

  ClosureLinterView.content = function() {
    return this.div({
      'class': 'closure-linter overlay tooltip in'
    }, (function(_this) {
      return function() {
        _this.button({
          'class': 'close',
          type: 'button'
        }, function() {
          return _this.span('×');
        });
        return _this.div('', {
          'class': 'message'
        });
      };
    })(this));
  };

  ClosureLinterView.prototype.initialize = function(serializeState) {
    this.on('click', '.close', (function(_this) {
      return function() {
        return _this.destroy();
      };
    })(this));
    return atom.workspaceView.on('pane:active-item-changed', (function(_this) {
      return function() {
        return _this.destroy();
      };
    })(this));
  };

  ClosureLinterView.prototype.serialize = function() {};

  ClosureLinterView.prototype.destroy = function() {
    this.editorView.off('keyup.cl');
    return this.detach();
  };

  ClosureLinterView.prototype.message = function(_arg) {
    var message;
    message = _arg.message;
    message || (message = NO_MESSAGE);
    return this.find('.message').text('Closure Linter: ' + message);
  };

  ClosureLinterView.prototype.notice = function() {
    this.editorView = atom.workspaceView.getActiveView();
    if (this.hasParent()) {
      return this.destroy();
    } else {
      this.editorView.on('keyup.cl', (function(_this) {
        return function(evt) {
          if (evt.keyCode === KEYCODE_ESC) {
            return _this.destroy();
          }
        };
      })(this));
      return atom.workspaceView.append(this);
    }
  };

  return ClosureLinterView;

})(View);
