{View} = require 'atom'
NO_MESSAGE = 'no errors found'

module.exports =

class ClosureLinterView extends View
  @content: ->
    @div class: 'closure-linter overlay from-top', =>
      @div "", class: "message"

  initialize: (serializeState) ->

  # Returns an object that can be retrieved when package is activated
  serialize: ->

  # Tear down any state and detach
  destroy: ->
    @detach()

  message: ({message}) ->
    message or= NO_MESSAGE
    console.log "ClosureLinterView: " + message
    this.find('.message').text('Closure Linter: ' + message)

  notice: ->
    if @hasParent()
      @detach()
    else
      atom.workspaceView.append(this)
