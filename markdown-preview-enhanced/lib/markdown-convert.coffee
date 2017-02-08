path = require 'path'
fs = require 'fs'
{Directory} = require 'atom'
{execFile} = require 'child_process'
async = require 'async'
Viz = require '../dependencies/viz/viz.js'
plantumlAPI = require './puml'
codeChunkAPI = require './code-chunk'
{svgAsPngUri} = require '../dependencies/save-svg-as-png/save-svg-as-png.js'
processGraphs = require './process-graphs'
encrypt = require './encrypt'
CACHE = require './cache'

# TODO: refactor this file
# it has common functions as pandoc-convert.coffee

processMath = (text)->
  text = text.replace(/\\\$/g, '#slash_dollarsign#')

  # display
  text = text.replace /\$\$([\s\S]+?)\$\$/g, ($0, $1)->
    $1 = $1.replace(/\n/g, '').replace(/\#slash\_dollarsign\#/g, '\\\$')
    $1 = escape($1)
    "<p align=\"center\"><img src=\"http://api.gmath.guru/cgi-bin/gmath?#{$1.trim()}\"/></p>"

  # inline
  r = /\$([\s\S]+?)\$/g
  text = text.replace /\$([\s\S]+?)\$/g, ($0, $1)->
    $1 = $1.replace(/\n/g, '').replace(/\#slash\_dollarsign\#/g, '\\\$')
    $1 = escape($1)
    "<img src=\"http://api.gmath.guru/cgi-bin/gmath?#{$1.trim()}\"/>"

  text = text.replace(/\#slash\_dollarsign\#/g, '\\\$')
  text

# convert relative path to project path
processPaths = (text, rootDirectoryPath, projectDirectoryPath, useAbsoluteImagePath)->
  match = null
  offset = 0
  output = ''

  resolvePath = (src)->
    if src.startsWith('http://') or src.startsWith('https://') or src.startsWith('file://')
      return src

    if useAbsoluteImagePath
      if src.startsWith('/')
        return src
      else # ./test.png or test.png
        return '/' + path.relative(projectDirectoryPath, path.resolve(rootDirectoryPath, src))
    else
      if src.startsWith('/')
        return path.relative(rootDirectoryPath, path.resolve(projectDirectoryPath, '.'+src))
      else # ./test.png or test.png
        return src

  # replace path in ![](...) and []()
  r = /(\!?\[.*?]\()([^\)|^'|^"]*)(.*?\))/gi
  text = text.replace r, (whole, a, b, c)->
    if b[0] == '<'
      b = b.slice(1, b.length-1)
      a + '<' + resolvePath(b.trim()) + '> ' + c
    else
      a + resolvePath(b.trim()) + ' ' + c

  # replace path in tag
  r = /(<[img|a|iframe].*?[src|href]=['"])(.+?)(['"].*?>)/gi
  text = text.replace r, (whole, a, b, c)->
    a + resolvePath(b) + c

  text

markdownConvert = (text, {projectDirectoryPath, rootDirectoryPath}, config={})->
  if !config.path
    return atom.notifications.addError('{path} has to be specified')

  if !config.image_dir
    return atom.notifications.addError('{image_dir} has to be specified')

  # dest
  if config.path[0] == '/'
    outputFilePath = path.resolve(projectDirectoryPath, '.' + config.path)
  else
    outputFilePath = path.resolve(rootDirectoryPath, config.path)

  delete(CACHE[outputFilePath])

  useAbsoluteImagePath = config.absolute_image_path

  # change link path to project '/' path
  # this is actually differnet from pandoc-convert.coffee
  text = processPaths text, rootDirectoryPath, projectDirectoryPath, useAbsoluteImagePath

  text = processMath text

  # TODO: create imageFolder
  if config['image_dir'][0] == '/'
    imageDirectoryPath = path.resolve(projectDirectoryPath, '.' + config['image_dir'])
  else
    imageDirectoryPath = path.resolve(rootDirectoryPath, config['image_dir'])

  atom.notifications.addInfo('Your document is being prepared', detail: ':)')

  imageDir = new Directory(imageDirectoryPath)
  imageDir.create().then (flag)->

    # mermaid / viz / wavedrom graph
    processGraphs text, {rootDirectoryPath, projectDirectoryPath, imageDirectoryPath, imageFilePrefix: encrypt(outputFilePath), useAbsoluteImagePath}, (text, imagePaths=[])->
      fs.writeFile outputFilePath, text, (err)->
        return atom.notifications.addError('failed to generate markdown') if err
        atom.notifications.addInfo("File #{path.basename(outputFilePath)} was created", detail: "path: #{outputFilePath}")


module.exports = markdownConvert