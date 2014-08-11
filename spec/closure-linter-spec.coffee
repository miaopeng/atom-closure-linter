fs = require('fs')
path = require 'path'
UglifyJS = require 'uglify-js'
{WorkspaceView} = require 'atom'
ClosureLinter = require '../lib/closure-linter'


# Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
#
# To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
# or `fdescribe`). Remove the `f` to unfocus the block.

describe "ClosureLinter", ->
  activationPromise = null
  filePath = path.join __dirname, 'fixture', 'ugly.js'
  console.log 'filepath', filePath

  beforeEach ->
    atom.workspaceView = new WorkspaceView
    activationPromise = atom.packages.activatePackage('closure-linter')

  afterEach ->
    source = UglifyJS.minify(filePath)
    fs.writeFileSync filePath, source.code


  describe "when the closure-linter:fixjsstyle event is triggered", ->
    it "fix code styles for javascript file", ->
      flag = false

      runs ->
        ClosureLinter.fixStyle filePath, ->
          source = fs.readFileSync filePath
          expect(source.length).toBe(9)
          flag = true

      waitsFor ->
        flag
      , 'code style fixed'

      # expect(atom.workspaceView.find('.closure-linter')).not.toExist()

      # This is an activation event, triggering it will cause the package to be
      # activated.
      # atom.workspaceView.trigger 'closure-linter:toggle'
      #
      # waitsForPromise ->
      #   activationPromise
      #
      # runs >
      #   expect(atom.workspaceView.find('.closure-linter')).toExist()
      #   atom.workspaceView.trigger 'closure-linter:toggle'
      #   expect(atom.workspaceView.find('.closure-linter')).not.toExist()
