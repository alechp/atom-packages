# 擴展 Markdown Parser

運行 `Markdown Preview Enhanced: Extend Parser` 命令。    
然後 `parser.js` 文件。    

> `parser.js` 文件位於 `~/.mume/parser.js`   


```javascript
module.exports = {
  onWillParseMarkdown: function(markdown) {
    return new Promise((resolve, reject)=> {
      return resolve(markdown)
    })
  },
  onDidParseMarkdown: function(html) {
    return new Promise((resolve, reject)=> {
      return resolve(html)
    })
  }
}
```

例如，你想在每個標題前添加 `😀` ，那麼你需要編輯 `onWillParseMarkdown` 如下：  

```javascript
module.exports = {
  onWillParseMarkdown: function(markdown) {
    return new Promise((resolve, reject)=> {
      markdown = markdown.replace(/#+\s+/gm, ($0)=> $0+'😀 ')
      return resolve(markdown)
    })
  }
}
```



![screen shot 2017-07-14 at 1 04 19 am](https://user-images.githubusercontent.com/1908863/28200243-78e1a10a-6830-11e7-836b-2defc528ee07.png)


再例如，你想要使用 `<div class="mermaid"></div>` 的寫法來渲染 `mermaid` 圖形。  

```javascript
module.exports = {
  onWillParseMarkdown: function(markdown) {
    return new Promise((resolve, reject)=> {
      markdown = markdown.replace(
        /\<div\s*class\=\"mermaid\"\>([\w\W]+?)\<\/div\>/g, 
        (whole, content)=>`
\`\`\`mermaid
${content}
\`\`\`
        `)
      return resolve(markdown)
    })
  }
}
```

![screen shot 2017-07-22 at 6 25 01 pm](https://user-images.githubusercontent.com/1908863/28495177-1a307b18-6f0b-11e7-9bfc-23213d7b2e35.png)
