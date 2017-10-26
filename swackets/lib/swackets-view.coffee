{Range, Point, CompositeDisposable} = require 'atom'

module.exports =
class SwacketsView

    intervalID = null
    openBrackets = 0
    config = {}
    totalColors = 11
    stylesheet = null

    constructor: ->
        config = @config()
        @applyStylesheet()
        @sweatifyTimeout()

        @subscriptions = new CompositeDisposable
        @subscriptions.add atom.workspace.onDidChangeActivePaneItem =>
            config = @config()
            @applyStylesheet()
            @sweatifyTimeout()
            editor = atom.workspace.getActiveTextEditor()
            return unless editor
            @subscriptions.add editor.onDidChange(@sweatifyTimeout)

        intervalID = setInterval @sweatifyTimeout, 140 #onScroll better in some cases, worse when scrolling

        editor = atom.workspace.getActiveTextEditor()
        return unless editor
        @subscriptions.add editor.onDidChange(@sweatifyTimeout)

    destroy: ->
        clearInterval(intervalID)
        @subscriptions.dispose()

    config: ->
        open = []
        close = []

        if (atom.config.get('swackets.colorBrackets'))
          open.push '{'
          close.push '}'

        if (atom.config.get('swackets.colorParens'))
          open.push '('
          close.push ')'

        if (atom.config.get('swackets.colorSquareBrackets'))
          open.push '['
          close.push ']'

        openExpr = ('\\' + s for s in open).join('')
        closeExpr = ('\\' + s for s in close).join('')
        expr = openExpr + closeExpr

        return {
          openSyntax: open,
          closeSyntax: close,
          regex: new RegExp('^.*?([' + expr + ']+)$'),
          openRegex: new RegExp('[' + openExpr + ']', 'g'),
          closeRegex: new RegExp('[' + closeExpr + ']', 'g')
        }

    getSwacketsStylesheet: ->
        if !stylesheet
          stylesheet = document.createElement('style')
          stylesheet.id = 'swackets-custom-style'
          stylesheet.appendChild document.createTextNode('')
          document.head.appendChild stylesheet
        stylesheet.sheet

    applyStylesheet: ->
        sheet = @getSwacketsStylesheet()
        colors = atom.config.get('swackets.colors')
        totalColors = colors.length - 1
        for rule in sheet.cssRules
          sheet.deleteRule(0)
        for color, index in colors
          sheet.insertRule("atom-text-editor .swackets-#{index} {color: #{color}}", 0)

    sweatifyTimeout: =>
        setTimeout @sweatify, 16

    sweatify: =>
        lines = document.querySelector('atom-text-editor.is-focused .lines')
        return if !lines
        lines.style.display = 'none'

        lineGroups = @lineGroupsQueryToArray document.querySelectorAll('atom-text-editor.is-focused .lines > div:not(.cursors) > div:not(.icon-right)')
        @sweatifyLineGroups(lineGroups)

        lines.style.display = ''

    lineGroupsQueryToArray: (allLines) ->
        validLines = []
        for item in allLines
            # TODO investigate if other conditions are needed
            continue if item.dataset.screenRow == undefined
            validLines.push item
        validLines

    sweatifyLineGroups: (lineGroups) ->
        sortedLineGroups = lineGroups.sort (a, b) =>
            Math.min(1, Math.max(-1, a.dataset.screenRow - b.dataset.screenRow))

        firstLine = sortedLineGroups[0]
        openBrackets = @openBracketsOffsetFor(+firstLine.dataset.screenRow)

        sortedLineGroups.forEach (lineGroup) =>
            spans = lineGroup.querySelectorAll('span:not(.comment)')
            @sweatifySpans(spans)

    openBracketsOffsetFor: (lineNumber) ->
        {openRegex, closeRegex} = config

        range = new Range(new Point(0, 0), new Point(lineNumber, 0))
        editor = atom.workspace.getActiveTextEditor()
        return 0 unless editor
        text = editor.getTextInBufferRange(range)

        openBracketsOffset = 0
        openBracketsOffset += text.match(openRegex)?.length || 0
        openBracketsOffset -= text.match(closeRegex)?.length || 0

        return Math.max(0, openBracketsOffset % (totalColors + 1))

    sweatifySpans: (spans) ->
        {regex} = config

        for span in spans
            match = span.innerHTML.match(regex)
            @sweatifySpan(span, match) if match

    sweatifySpan: (span, match) ->
        {openRegex, closeRegex} = config

        color = openBrackets
        if (match[0].match(openRegex)) and (! match[0].match(closeRegex))
            openBrackets++
            if openBrackets > totalColors
                openBrackets = 0
        else if (match[0].match(closeRegex)) and (! match[0].match(openRegex))
            openBrackets--
            if openBrackets < 0
                openBrackets = totalColors
            color = openBrackets
        className = ' swackets-' + color
        span.className = span.className.replace(/( swackets-\d+|$)/, className)
