{ CompositeDisposable } = require 'atom'
d = (require './debug') 'refactor:watcher'

module.exports =
class Watcher

  constructor: (@moduleManager, @editor) ->
    @disposables = new CompositeDisposable
    @disposables.add @editor.onDidStopChanging @onBufferChanged
    @disposables.add @editor.onDidChangeCursorPosition @onCursorMoved
    @disposables.add @moduleManager.onActivated @verifyGrammar
    @verifyGrammar()

  dispose: =>
    @deactivate()
    @disposables.dispose()
    @moduleManager = null
    @editor = null
    @module = null

  ###
  Grammar valification process
  1. Detect grammar changed.
  2. Destroy instances and listeners.
  3. Exit process when the language plugin of the grammar can't be found.
  4. Create instances and listeners.
  ###

  verifyGrammar: =>
    scopeName = @editor.getGrammar().scopeName
    module = @moduleManager.getModule scopeName
    d 'verify grammar', scopeName, module
    return if module is @module
    @deactivate()
    return unless module?
    @module = module
    @activate()

  activate: ->
    # Setup model
    @ripper = new @module.Ripper()

    # Start listening
    @eventCursorMoved = on
    @eventBufferChanged = on

    d 'activate and parse'
    @parse()

  deactivate: ->
    d 'deactivate'

    if @ripper?
      @ripper.dispose?()
      @ripper = null

    # Stop listening
    @cursorMoved = false

    @eventCursorMoved = off
    @eventBufferChanged = off
    clearTimeout @cursorMovedTimeoutId

    # Remove references
    @cursorMovedTimeoutId = null
    @module = null
    @renamingCursor = null
    @renamingMarkers = null


  ###
  Reference finder process
  1. Stop listening cursor move event and reset views.
  2. Parse.
  3. Show errors and exit process when compile error is thrown.
  4. Show references.
  5. Start listening cursor move event.
  ###

  parse: =>
    d 'parse'
    @eventCursorMoved = off
    text = @editor.buffer.getText()
    if text isnt @cachedText
      @destroyReferences()
      @destroyErrors()
      @cachedText = text
      @ripper.parse text, @onParseEnd
    @eventCursorMoved = on

  update: (changes) =>
    return if changes.length is 0
    if typeof @ripper.update isnt 'function'
      @parse()
    else @ripper.update change for change in changes

  onParseEnd: (errors) =>
    d 'onParseEnd'
    if errors?
      @createErrors errors
    else
      @createReferences()

  destroyErrors: ->
    d 'destroy errors'
    return unless @errorMarkers?
    for marker in @errorMarkers
      marker.destroy()
    @errorMarkers = null

  createErrors: (errors) =>
    d 'create errors'
    @errorMarkers = for { range, message } in errors
      marker = @editor.markBufferRange range
      d 'marker', range, marker
      @editor.decorateMarker marker, type: 'highlight', class: 'refactor-error'
      @editor.decorateMarker marker, type: 'line-number', class: 'refactor-error'
      # TODO: show error message
      marker

  destroyReferences: ->
    d 'destroyReferences'
    return unless @referenceMarkers?
    for marker in @referenceMarkers
      marker.destroy()
    delete @referenceMarkers

  createReferences: ->
    d 'createReferences'
    ranges = @ripper.find @editor.getSelectedBufferRange().start
    return unless ranges? and ranges.length > 0
    @referenceMarkers = for range in ranges
      marker = @editor.markBufferRange range
      cls =
        if range.type
          'refactor-' + range.type
        else 'refactor-reference'
      @editor.decorateMarker marker, type: 'highlight', class: cls
      marker


  ###
  Renaming life cycle.
  1. When detected rename command, start renaming process.
  2. When the cursors move out from the symbols, abort and exit renaming process.
  3. When detected done command, exit renaming process.
  ###

  rename: ->
    # When this editor isn't active, returns false to abort keyboard binding.
    return false unless @isActive()

    # Find references.
    # When no reference exists, do nothing.
    cursor = @editor.getLastCursor()
    ranges = @ripper.find cursor.getBufferPosition()
    return false unless ranges? and ranges.length > 0

    # Pause highlighting life cycle.
    @destroyReferences()
    @eventBufferChanged = off
    @eventCursorMoved = off

    #TODO Cursor::clearAutoScroll()

    # Register the triggered cursor.
    @renamingCursor = cursor.getBufferPosition()
    # Select references.
    # Register the markers of the references' ranges.
    # Highlight these markers.
    @renamingMarkers = for range in ranges
      marker = @editor.markBufferRange range
      marker.shorthand = range.shorthand
      marker.delimiter = range.delimiter
      marker.key = @editor.markBufferRange range.key if range.key
      @editor.decorateMarker marker, type: 'highlight', class: 'refactor-reference'
      marker

    for marker in @renamingMarkers
      if marker.shorthand
        range = marker.getBufferRange()
        origin = @editor.markBufferRange range, invalidate: 'inside'
        text = @editor.getTextInBufferRange range
        start = range.start
        @editor.setTextInBufferRange [start, start], marker.delimiter, undo: 'skip'
        key = @editor.setTextInBufferRange [start, start], text
        marker.key = @editor.markBufferRange key
        marker.setBufferRange origin.getBufferRange()

    for marker in @renamingMarkers
      @editor.addSelectionForBufferRange marker.getBufferRange()

    # Start renaming life cycle.
    @eventCursorMoved = 'abort'

    # Returns true not to abort keyboard binding.
    true

  abort: (event) =>
    # When this editor isn't active, do nothing.
    return unless @isActive() and @renamingCursor? and @renamingMarkers?

    d 'move cursor from', event.oldBufferPosition, 'to', event.newBufferPosition
    for marker in @renamingMarkers
      return if marker.getBufferRange().containsPoint event.newBufferPosition
    @done()
    return

    # Verify all cursors are in renaming markers.
    # When the cursor is out of marker at least one, abort renaming.
    selectedRanges = @editor.getSelectedBufferRanges()
    isMarkersContainsCursors = true
    for marker in @renamingMarkers
      markerRange = marker.getBufferRange()
      isMarkerContainsCursor = false
      for selectedRange in selectedRanges
        isMarkerContainsCursor or= markerRange.containsRange selectedRange
        break if isMarkerContainsCursor
      isMarkersContainsCursors and= isMarkerContainsCursor
      break unless isMarkersContainsCursors
    return if isMarkersContainsCursors
    @done()

  done: ->
    d 'done'
    # When this editor isn't active, returns false for aborting keyboard binding.
    return false unless @isActive() and @renamingCursor? and @renamingMarkers?

    # Stop renaming life cycle.
    @eventCursorMoved = off

    # Reset cursor's position to the triggerd cursor's position.
    @editor.setCursorBufferPosition @renamingCursor
    delete @renamingCursor
    # Remove all markers for renaming.
    for marker in @renamingMarkers
      if marker.key
        key = @editor.getTextInBufferRange marker.key.getBufferRange()
        value = @editor.getTextInBufferRange marker.getBufferRange()
        if key == value
          @editor.setTextInBufferRange [marker.key.getStartBufferPosition(), marker.getStartBufferPosition()], ''
      marker.destroy()
    delete @renamingMarkers

    # Start highlighting life cycle.
    d 'done and reparse'
    @parse()
    @eventBufferChanged = on
    @eventCursorMoved = on

    # Returns true not to abort keyboard binding.
    true


  ###
  User events
  ###

  onBufferChanged: (event) =>
    return unless @eventBufferChanged
    d 'buffer changed', event
    @update(event.changes)

  onCursorMoved: (event) =>
    return unless @eventCursorMoved
    if @eventCursorMoved == 'abort'
      @abort event
    else
      clearTimeout @cursorMovedTimeoutId
      @cursorMovedTimeoutId = setTimeout @onCursorMovedAfter, 100

  onCursorMovedAfter: =>
    @destroyReferences()
    @createReferences()


  ###
  Utility
  ###

  isActive: ->
    @module? and atom.workspace.getActivePaneItem() is @editor
