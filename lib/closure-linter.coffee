_ = require 'underscore'
{gjslint, fixjsstyle} = require("closure-linter-wrapper")
View = require "./closure-linter-view"

module.exports =
  activate: ->
    @view = new View()
    atom.workspaceView.command "closure-linter:fixjsstyle", => @fixFileStyle()

  fixFileStyle: ->
    editor = atom.workspace.activePaneItem
    file = editor?.buffer.file
    src = file?.path
    @fixStyle(src)

  fixStyle: (src, callback) ->
    callback or= (err, result) =>
      @notice(result) if !err

    fixjsstyle {
      flags: ['--nojsdoc'],
      src: [src],
      reporter: {
        # name: 'console'
      }
    }, callback

  lint: (src) ->
    gjslint {
      flags: ['--nojsdoc'],
      src: [src],
      reporter: {
        name: 'console'
      }
    }, (err, result) ->
      console.log('Everything went fine') if !err


  notice: (message) ->
    if @view
      @view.message({message})
      @view.notice()
