// 获取存储的数据
chrome.storage.local.get("savedPages", function (result) {
  if (result.savedPages) {
    var savedPages = result.savedPages;
    // 遍历已保存的页面数据
    renderList(savedPages)
  } else {
    console.log("未找到存储的数据");
  }
});

function renderList(savedPages){
    var list = document.getElementById("list");
    savedPages.forEach(function (pageData) {
        var div = document.createElement("div");
        div.classList = "line"

        // 创建 <a> 元素
        var link = document.createElement("a");
        link.href = pageData.url;
        link.innerHTML = pageData.title;
        link.classList=""
        link.onclick = function () {
          // 在点击时打开新标签页
          chrome.tabs.update({ url: pageData.url });
        };
  
        // 创建 <img> 元素
        var icon = document.createElement("img");
        icon.src = pageData.icon;
        icon.alt = "Page Icon";
        icon.classList="page-icon"
  
        // 创建删除按钮
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "删除";
        deleteButton.classList = "button is-danger is-text is-small"
        deleteButton.onclick = function () {
          const newSavePages = savedPages.filter((savedPage) => {
            return savedPage.id !== pageData.id;
          });
  
          chrome.storage.local.set({ savedPages: newSavePages }, function () {
            console.log("已删除的数据");
          });
          list.innerHTML = ""
          renderList(newSavePages)
        };
  
        // 将 <a> 和 <img> 元素添加到页面中
        div.appendChild(icon);
        div.appendChild(link);
        div.appendChild(deleteButton);

        list.appendChild(div);
      });
}

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
