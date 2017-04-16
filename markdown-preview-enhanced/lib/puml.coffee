path = require 'path'
{spawn} = require 'child_process'

plantumlJarPath = path.resolve(__dirname, '../dependencies/plantuml/plantuml.jar')

# Async call
generateSVG = (content, fileDirectoryPath='', callback)->
  content = content.trim()
  # ' @mpe_file_directory_path:/fileDirectoryPath
  # fileDirectoryPath

  fileDirectoryPath = content.match(/^'\s@mpe_file_directory_path:(.+)$/m)?[1] or fileDirectoryPath

  if !content.startsWith('@start')
    content = """
@startuml
#{content}
@enduml
    """

  task = spawn 'java', [    '-Djava.awt.headless=true',
                            '-Dplantuml.include.path='+fileDirectoryPath
                            '-jar', plantumlJarPath,
                            # '-graphvizdot', 'exe'
                            '-pipe',
                            '-tsvg',
                            '-charset', 'UTF-8']

  task.stdin.write(content)
  task.stdin.end()

  chunks = []
  task.stdout.on 'data', (chunk)->
    chunks.push(chunk)

  task.stdout.on 'end', ()->
    data = Buffer.concat(chunks).toString()
    callback?(data)

# generateSVG('A -> B')
plantumlAPI = {
  render: generateSVG
}

module.exports = plantumlAPI
