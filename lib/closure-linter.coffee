{BufferedProcess, $$} = require 'atom'
_ = require 'underscore'
View = require "./closure-linter-view"

module.exports =
  activate: ->
    @view = new View()
    atom.workspaceView.command "closure-linter:fixjsstyle", => @fixStyle()

  fixStyle: ->
    editor = atom.workspace.activePaneItem
    file = editor?.buffer.file
    filePath = file?.path
    out = ''

    command = "fixjsstyle"
    args = ['--nojsdoc', "#{filePath}"]
    stdout = (output) ->
      out = output

    exit = (code) =>
      console.log("fixjsstyle exited with #{code}")
      @view.message({message: out})
      @view.notice()

    # Run process
    @bufferedProcess = new BufferedProcess({
      command, args, stdout, exit
    })

    @bufferedProcess.process.on 'error', (nodeError) ->
      console.log (nodeError.message)
      console.log ("Unable to run #{_.escape command}")
      console.log ("PATH: #{_.escape process.env.PATH}")
