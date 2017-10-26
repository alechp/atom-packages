{CompositeDisposable} = require "atom"
SwacketsView = require './swackets-view'

module.exports =

  config:
    colors:
        title: 'Syntax Colours To Use:'
        default: ['#9c5e99', '#8ab7d8', '#60dd60', '#ffff70', '#ea9d70', '#971717']
        type: 'array'
        items:
            type: 'string'

    colorBrackets:
        title: 'Color Brackets'
        type: 'boolean'
        default: true

    colorParens:
        title: 'Color Parentheses'
        type: 'boolean'
        default: false

    colorSquareBrackets:
        title: 'Color Square Brackets'
        type: 'boolean'
        default: false

  areaView: null

  activate: (state) ->
    @areaView = new SwacketsView()

  deactivate: ->
    @areaView.destroy()
    @areaView = null
