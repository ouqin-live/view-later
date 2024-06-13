chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "savePage",
    title: "view later",
    contexts: ["page"],
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === "savePage") {
    console.log("info", info);
    console.log("tab", tab);

    // 存储当前网址和图标
    var pageData = {
      id: new Date().getTime(),
      url: tab.url,
      icon: tab.favIconUrl,
      title: tab.title
    };

    // 从本地存储中获取已保存的页面数据
    chrome.storage.local.get("savedPages", function (result) {
      var savedPages = result.savedPages || [];
      console.log("存：",savedPages)
      savedPages.push(pageData);

      // 将更新后的数据保存到本地存储
      chrome.storage.local.set({ savedPages: savedPages }, function () {
        console.log("当前网址和图标已保存");
      });
    });
  }
});