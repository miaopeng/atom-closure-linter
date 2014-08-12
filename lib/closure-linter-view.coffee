{View} = require 'atom'
NO_MESSAGE = 'no errors found'
KEYCODE_ESC = 27

module.exports =

class ClosureLinterView extends View
  @content: ->
    @div class: 'closure-linter overlay tooltip in', =>
      @button class: 'close', type: 'button', =>
        @span '×'
      @div "", class: "message"

  initialize: (serializeState) ->
    @on 'click', '.close', =>
      @destroy()
    atom.workspaceView.on 'pane:active-item-changed', =>
      @destroy()

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @editorView.off('keyup.cl')
    @detach()

  message: ({message}) ->
    message or= NO_MESSAGE
    this.find('.message').text('Closure Linter: ' + message)

  notice: ->
    @editorView = atom.workspaceView.getActiveView()
    if @hasParent()
      @destroy()
    else
      @editorView.on 'keyup.cl', (evt) =>
        @destroy() if evt.keyCode == KEYCODE_ESC
      atom.workspaceView.append(this)
