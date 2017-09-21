# 目錄列表（TOC）
**Markdown Preview Enhanced** 支持你在 markdown 文件中創建 `TOC`。  
你可以通過 <kbd>cmd-shift-p</kbd> 然後選擇 `Markdown Preview Enhanced: Create Toc` 命令來創建 `TOC`。  
多個 TOCs 可以被創建。  
如果你想要在你的 `TOC` 中排除一個標題，請在你的標題 **後面** 添加 `{ignore=true}` 即可。

![screen shot 2017-07-14 at 1 56 32 am](https://user-images.githubusercontent.com/1908863/28201657-abf1ac78-6837-11e7-9a08-e785df68e19b.png)

> TOC 將會在你的 markdown 文件保存時更新。  
> 你需要保持預覽打開才能更新 TOC。

## 設置  
* **orderedList**  
是否使用有序列表。
* **depthFrom**, **depthTo**  
`[1~6]` 包含的。   
* **ignoreLink**
如果設置為 `true`，那麼 TOC 將不會被超鏈接。  

[➔ 導入文件](zh-tw/file-imports.md)

## [TOC]  
你也可以通過在你的 markdown 文件中輸入 `[TOC]` 來創建 `TOC`。  
例如：  
```markdown  

[TOC]  

# 標題1
## 標題2 {ignore=true}
標題2 將會被目錄忽略.  
```
但是，這種方式創建的 `TOC` 只會在預覽中顯示，而不會修改你的 markdown 文件。

## [TOC] 以及邊欄 TOC 的設置

你可以通過編寫 front-matter 來進行設置：
```markdown
---
toc:
  depth_from: 1
  depth_to: 6
  ordered: false
---
```