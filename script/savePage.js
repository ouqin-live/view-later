chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: "savePage",
    title: "保存页面",
    contexts: ["page"],
  });

  chrome.contextMenus.create({
    id: "saveLink",
    title: "保存链接",
    contexts: ["link"],
  });

  chrome.contextMenus.create({
    id: "saveImage",
    title: "保存图片",
    contexts: ["image"],
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  console.log("info:",info)
  console.log("tab:",tab)
  switch(info.menuItemId){
    case "savePage":{
      var pageData = {
        id: new Date().getTime(),
        url: tab.url,
        icon: tab.favIconUrl,
        title: tab.title,
        clickCount:0
      };
  
      savedPageFunc(pageData)
      break
    }
    case "saveLink":{
      var pageData = {
        id: new Date().getTime(),
        url: info.linkUrl,
        icon: tab.favIconUrl,
        title: info.selectionText,
        clickCount:0
      };
      savedPageFunc(pageData)
      break
    }
    case "saveImage":{
      var pageData = {
        id: new Date().getTime(),
        url: info.srcUrl,
        icon: info.srcUrl,
        title: `图片${new Date().getTime()}`,
        clickCount:0
      };
      savedPageFunc(pageData)
      break
    }
  }
});

function savedPageFunc(pageData){
  // 从本地存储中获取已保存的页面数据
  chrome.storage.local.get("savedPages", function (result) {
    var savedPages = result.savedPages || [];
    savedPages.push(pageData);

    // 将更新后的数据保存到本地存储
    chrome.storage.local.set({ savedPages: savedPages });

    chrome.runtime.sendMessage({action: "update"});
  });
}