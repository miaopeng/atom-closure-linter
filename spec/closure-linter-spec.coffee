{WorkspaceView} = require 'atom'
ClosureLinter = require '../lib/closure-linter'

# Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
#
# To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
# or `fdescribe`). Remove the `f` to unfocus the block.

describe "ClosureLinter", ->
  activationPromise = null

  beforeEach ->
    atom.workspaceView = new WorkspaceView
    activationPromise = atom.packages.activatePackage('closure-linter')

  describe "when the closure-linter:toggle event is triggered", ->
    it "attaches and then detaches the view", ->
      expect(atom.workspaceView.find('.closure-linter')).not.toExist()

      # This is an activation event, triggering it will cause the package to be
      # activated.
      atom.workspaceView.trigger 'closure-linter:toggle'

      waitsForPromise ->
        activationPromise

      runs ->
        expect(atom.workspaceView.find('.closure-linter')).toExist()
        atom.workspaceView.trigger 'closure-linter:toggle'
        expect(atom.workspaceView.find('.closure-linter')).not.toExist()
