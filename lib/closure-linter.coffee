{BufferedProcess, $$} = require 'atom'
_ = require 'underscore'

module.exports =
  activate: ->
    atom.workspaceView.command "closure-linter:fixjsstyle", => @fixStyle()

  fixStyle: ->
    editor = atom.workspace.activePaneItem
    file = editor?.buffer.file
    filePath = file?.path

    command = "fixjsstyle"
    args = ['--nojsdoc', "#{filePath}"]
    stdout = (output) -> console.log(output)
    exit = (code) -> console.log("fixjsstyle exited with #{code}")

    # Run process
    @bufferedProcess = new BufferedProcess({
      command, args, stdout, exit
    })

    @bufferedProcess.process.on 'error', (nodeError) =>
      console.log (nodeError.message)
      console.log ("Unable to run #{_.escape command}")
      console.log ("PATH: #{_.escape process.env.PATH}")
