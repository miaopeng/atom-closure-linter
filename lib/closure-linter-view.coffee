{View} = require 'atom'

module.exports =
class ClosureLinterView extends View
  @content: ->
    @div class: 'closure-linter overlay from-top', =>
      @div "The ClosureLinter package is Alive! It's ALIVE!", class: "message"

  initialize: (serializeState) ->
    atom.workspaceView.command "closure-linter:toggle", => @toggle()

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @detach()

  toggle: ->
    console.log "ClosureLinterView was toggled!"
    if @hasParent()
      @detach()
    else
      atom.workspaceView.append(this)
