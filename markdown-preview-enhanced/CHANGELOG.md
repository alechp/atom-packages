## 0.9.5  
* [x] upgrade `mermaid` to `7.0.0`, but class diagram still doesn't work.  
* [x] upgrade `reveal.js` to `1.4.1`.
* [x] upgrade `katex` to `0.7.1`, fix cdn.js issue.
* [x] upgrade `plantuml` to version `8054`.
* [x] upgrade `viz.js` to version `1.7.0`, could be buggy though.
* [x] partially fixed issue [#248](https://github.com/shd101wyy/markdown-preview-enhanced/issues/248). But can't navigate to anchor.   
* [x] better support for zen mode. 

## 0.9.4  
* [x] fix non-github syntax color issue [243](https://github.com/shd101wyy/markdown-preview-enhanced/issues/243)  
* [x] fix vertical slides issue [241](https://github.com/shd101wyy/markdown-preview-enhanced/issues/241)  

## 0.9.3
* [x] fix issue, 中文，日文 file image path error. [#236](https://github.com/shd101wyy/markdown-preview-enhanced/issues/236)
* [x] fix issue [#237](https://github.com/shd101wyy/markdown-preview-enhanced/issues/237)  
* [x] fix back to top button and code chunks run btn `onclick` event after restoring CACHE.
* [x] save as markdown `front_matter` config.

## 0.9.2
* [x] quick fix issue [#223](https://github.com/shd101wyy/markdown-preview-enhanced/issues/223)  

## 0.9.1
* [x] quick fix issue [#234](https://github.com/shd101wyy/markdown-preview-enhanced/issues/234)

## 0.9.0
* [x] soft tabs (spaces of tabs) in TOC [#187](https://github.com/shd101wyy/markdown-preview-enhanced/issues/187)
* [x] add cache support for better performance [#210](https://github.com/shd101wyy/markdown-preview-enhanced/issues/210)
* [x] add speaker notes support for presentation (reveal.js) issue [#199](https://github.com/shd101wyy/markdown-preview-enhanced/issues/199)
* [x] add back to top button in preview [#222](https://github.com/shd101wyy/markdown-preview-enhanced/issues/222)
* [x] support multiple TOCs [#130](https://github.com/shd101wyy/markdown-preview-enhanced/issues/130)
* [x] viz.js engine config
* [x] Save as Markdown
* [x] update several dependencies such as `KaTeX`, `saveSvgAsPng`, etc.

## 0.8.9  
* [x] `<kbr>` style is not consistent in browser
* [x] fix issue [#177](https://github.com/shd101wyy/markdown-preview-enhanced/issues/177)  
* [x] add `stdin` option to code chunk  
* [x] restore `run` and `all` buttons but only shown when hovered.  

## 0.8.8  
* [x] ISSUE: MathJax will also update when changing headings.  
* [x] update all dependencies.  
  * seems that `mermaid` is still of version `6.0.0` and class diagram doesn't work as expected.  
* [x] fix bug [#168](https://github.com/shd101wyy/markdown-preview-enhanced/issues/168).
* [x] disable `MathJax` `processEnvironments` [#167](https://github.com/shd101wyy/markdown-preview-enhanced/issues/167).
* [x] fix issue [#160](https://github.com/shd101wyy/markdown-preview-enhanced/issues/160)
* [x] fix issue [#150](https://github.com/shd101wyy/markdown-preview-enhanced/issues/150)
* [x] extend `TOC`. [#171](https://github.com/shd101wyy/markdown-preview-enhanced/issues/171)
* [x] remove `run` and `all` button for code chunk. also updated [code-chunk.md](/docs/code-chunk.md)

## 0.8.7 `minor update`
* [ ] <strike>reload cached image when necessary. (eg: replace `#cached=false` with `#cached=uid`)</strike>[**doesn't work very well; the image will flicker**]
* [x] fix one MathJax bug [#147](https://github.com/shd101wyy/markdown-preview-enhanced/issues/147)
* [ ] mermaid class diagram [#143](https://github.com/shd101wyy/markdown-preview-enhanced/issues/143) [**seem to be mermaid bug**]
* [ ] pandoc and ebook graph include [**implement in next major release**]
* [x] better pandoc error notification

## 0.8.6  
* [x] ebook export exception [#136](https://github.com/shd101wyy/markdown-preview-enhanced/issues/136)
* [x] TOC heading level bug [#134](https://github.com/shd101wyy/markdown-preview-enhanced/issues/134)
* [ ] extend table notation [#133](https://github.com/shd101wyy/markdown-preview-enhanced/issues/133)
* [x] ERD [#128](https://github.com/shd101wyy/markdown-preview-enhanced/issues/128) [**might be removed in the future**]
* [ ] <strike>ebook glossary like gitbook</strike>. [**not implemented**]
* [x] change graph APIs.
* [ ] change parseMD function to async function with callback.
* [ ] pandoc graph include [**may be implemented in next version**]
* [x] fix scroll sync bug for code block
* [x] support Code Chunk
* [x] change `Markdown Preview Enhanced: Toc Create` to `Markdown Preview Enhanced: Create Toc`
* [x] save `codeChunksData` state for each editor.

## 0.8.5
* [ ] support `yaml_table` [**not implement**]
* [ ] support `erd` [#128](https://github.com/shd101wyy/markdown-preview-enhanced/issues/128) [**not implement**]
* [x] scroll preview to the very bottom when cursor is in last 2 lines. (right now it is the last line)
* [x] fix ebook network image error [#129](https://github.com/shd101wyy/markdown-preview-enhanced/issues/129#issuecomment-245778986)
* [x] support `ebook-convert` args option
* [x] improve `ebook` config
* [x] fix `loading preview` stuck bug   
* [ ] remove `Markdown  Preivew Enhanced: Config Header and Footer`, use `front-matter` instead. [**Might be implemented in next release**]

## 0.8.4  
* [ ] fix issue [#107](https://github.com/shd101wyy/markdown-preview-enhanced/issues/107)  
* [ ] add TOC sidebar [#117](https://github.com/shd101wyy/markdown-preview-enhanced/issues/117)  
* [x] fix issue [#121](https://github.com/shd101wyy/markdown-preview-enhanced/issues/121) location save
* [x] add default document export path [#120](https://github.com/shd101wyy/markdown-preview-enhanced/issues/120)
* [x] fix issue [#118](https://github.com/shd101wyy/markdown-preview-enhanced/issues/118) add hint for image paste
* [x] support **pandoc**
* [x] add vertical slides for presentation [#123](https://github.com/shd101wyy/markdown-preview-enhanced/issues/123)
* [x] remove `Markdown Preview Enhanced: Config Presentation`, use front-matter instead   

## 0.8.3  
* [x] add option to `hide` frontmatter.  
* [x] change to `UIUC` license
* [x] upgrade APIs to match newest `electron`  
* [ ] solve lagging issue  
* [ ] header/footer for presentation  
* [x] smooth scroll sync

## 0.8.2  
* [x] fix issue [#106](https://github.com/shd101wyy/markdown-preview-enhanced/issues/106)
* [x] add file extensions support [#102](https://github.com/shd101wyy/markdown-preview-enhanced/issues/104)
* [x] fix issue [#107](https://github.com/shd101wyy/markdown-preview-enhanced/issues/107), now can use MathJax for phantomjs export
* [x] add zoomFactor [#93](https://github.com/shd101wyy/markdown-preview-enhanced/issues/93)  
* [ ] image drop to upload like github.  

Known issues:  
* `"` in MathJax are not escaped. `getAttribute('data-original')`

## 0.8.1
* [x] refactor **parseMD** function. (it's too messy now)  
* [x] for KaTeX rendering, save rendered results like MathJax.
* [ ] split on left side (it seems that `atom.workspace.open ` doesn't work as I expected)
* [x] typographer [#94](https://github.com/shd101wyy/markdown-preview-enhanced/issues/94)
* [ ] format markdown on save
* [x] modify `mermaid.css` [#95](https://github.com/shd101wyy/markdown-preview-enhanced/issues/95)
* [x] fix [#97](https://github.com/shd101wyy/markdown-preview-enhanced/issues/97)
* [ ] fix [#93](https://github.com/shd101wyy/markdown-preview-enhanced/issues/93) specify image resolution when exporting png/jpeg using phantomjs
* [x] support front matter [#100](https://github.com/shd101wyy/markdown-preview-enhanced/issues/100)
* [ ] support hooks [#101](https://github.com/shd101wyy/markdown-preview-enhanced/issues/101)
* [ ] **found [issue](https://github.com/marcbachmann/node-html-pdf/issues/156)**, I might implement phantomjs html2pdf by myself in the future...

## 0.8.0
* [ ] solve issue [#85](https://github.com/shd101wyy/markdown-preview-enhanced/issues/85)
* [x] merge pull request [#86](https://github.com/shd101wyy/markdown-preview-enhanced/pull/86)
* [ ] presentation print pdf link not working
* [x] epub generation. useful links [manual](http://pandoc.org/MANUAL.html) and [epub](http://pandoc.org/epub.html)

## 0.7.9
* [x] viz.js dot language
* [x] customize reveal css
* [x] check custom comment subject
* [x] shield.io
* [ ] table formatter
## 0.7.7
* [ ] distraction free writing mode like [laverna](https://github.com/Laverna/laverna) or zen. [useful link](https://discuss.atom.io/t/set-atom-cursor-to-font-size-not-line-height/11965/5).
* [x] presentation mode like [marp](https://github.com/yhatt/marp)
* [x] add **phantomjs** option besides **html** and **pdf**.
* [x] fix [issue](https://github.com/shd101wyy/markdown-preview-enhanced/issues/79)
## 0.7.3
* [ ] fix print to pdf deadlock issue (if I can...) (*Update*: It seems to be **electron** related, therefore I can't fix it.)
* [ ] print image [capturePage function](https://github.com/electron/electron/blob/master/docs/api/web-contents.md)
* [x] right click on preview displays 'print' option on context menu (**I decide not to implement this**)
* [x] update PlantUML to newest version
* [x] fix toggle bug.
* [x] support mermaid customized init function [see this issue](https://github.com/shd101wyy/markdown-preview-enhanced/issues/9#issuecomment-229552470)
* [ ] [this](https://github.com/shd101wyy/markdown-preview-enhanced/issues/9#issuecomment-231215294) is too hard.
* [x] open other files in atom through links [see this issue](https://github.com/shd101wyy/markdown-preview-enhanced/issues/72)
* [ ] let user choose to use local puml jar or through internet by [encode](https://github.com/markushedvall/plantuml-encoder) (no java required)(**I decide not to implement this**)
* [x] remove mermaidStyle at markdown-preview-enhanced-view.coffee. (as it is already included in markdown-preview-enhanced.less)
* [x] [WaveDrom](https://github.com/shd101wyy/markdown-preview-enhanced/issues/73) support?
* [x] preview window copy text.
* [ ] mermaid style: three .css file choice.

## 0.7.2
* [x] preview black color background problem

## 0.7.1
* [x] support customizable math delimiters
* [x] increase MathJax rendering speed
* [x] fix code block `//` comment color bug (现在是黑色的。。。)
* [x] fix WikiLink [#45](https://github.com/shd101wyy/markdown-preview-enhanced/issues/45)
* [x] fix TOC header bug [#48](https://github.com/shd101wyy/markdown-preview-enhanced/issues/48)
* [ ] add `javascript` support [#47](https://github.com/shd101wyy/markdown-preview-enhanced/issues/47) (可能无法完成)
* [x] image path config [here](https://github.com/shd101wyy/markdown-preview-enhanced/issues/30#issuecomment-224273160)
* [x] fix image project paths bug [here](https://github.com/shd101wyy/markdown-preview-enhanced/issues/34#issuecomment-224303126)

## 0.6.9
* [x] TOC numbered list

## 0.3.8
* support better way for customizing markdown down style.
* change markdown style.
* improve markdown parsing efficiency (use <strong>onDidStopChanging</strong> function instead of <strong>onDidChange</strong>).
* <strong>TODO</strong>: support scroll sync in the future.

## 0.3.7
* fix image path bug when export pdf and html.

## 0.3.6
* fix math expression parsing bug... caused by \_underscore\_.

## 0.3.5
* add \\newpage support.

## 0.3.3
* Add 'Open in Browser' option.
* Fix \$ bug.

## 0.1.0 - Initial Release
* Every feature added.
* Every bug fixed.
