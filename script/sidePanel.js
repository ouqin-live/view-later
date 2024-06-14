function init() {
  // 获取存储的数据
  chrome.storage.local.get("savedPages", function (result) {
    if (result.savedPages) {
      var savedPages = result.savedPages;
      // 遍历已保存的页面数据
      renderList(savedPages);
      console.log("savedPages",savedPages);
    } else {
      console.log("未找到存储的数据");
    }
  });
}

init();

function renderList(savedPages) {
  var list = document.getElementById("list");
  list.innerHTML = ""

  savedPages.forEach(function (pageData,index) {
    var div = document.createElement("div");
    div.classList = "line";

    // 创建 <a> 元素
    var link = document.createElement("a");
    link.href = pageData.url;
    link.innerHTML = pageData.title;
    if (pageData.clickCount === 0){
      link.classList = "";
    }else{
      link.classList = "browsed";
    }

    link.onclick = function () {
      // 在点击时打开新标签页
      chrome.tabs.update({ url: pageData.url });
      savedPages[index].clickCount +=1
      chrome.storage.local.set({ savedPages: savedPages }, function () {
        console.log("当前网址和图标已保存");
      });
      renderList(savedPages)
    };

    // 创建 <img> 元素
    var icon = document.createElement("img");
    icon.src = pageData.icon;
    icon.alt = "Page Icon";
    icon.classList = "page-icon";
    
    // 创建删除按钮
    var deleteButton = document.createElement("button");
    deleteButton.classList = "delete is-small";
    deleteButton.onclick = function () {
      const newSavePages = savedPages.filter((savedPage) => {
        return savedPage.id !== pageData.id;
      });

      chrome.storage.local.set({ savedPages: newSavePages }, function () {
        console.log("已删除的数据");
      });
      renderList(newSavePages);
    };

    // 将 <a> 和 <img> 元素添加到页面中
    div.appendChild(icon);
    div.appendChild(link);
    div.appendChild(deleteButton);

    list.appendChild(div);
  });
}

// Allows users to open the side panel by clicking on the action toolbar icon
// 侧栏
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));


// 保存时刷新侧边栏
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action === "update"){
        chrome.storage.local.get("savedPages", function (result) {
          if (result.savedPages) {
            var savedPages = result.savedPages;
            renderList(savedPages);
          } else {
            console.log("未找到存储的数据");
          }
        });
      }
    }
  );