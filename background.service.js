chrome.notifications.create(
    {
        type:"basic",
        iconUrl: "assets/img0001-modified-modified.png",
        title : "Update !!!",
        message: "Pingfence: Advanced Security Protocols Applied",
        silent: false
    },
    () => {}
);

var url_filter_obj = {'urls':['<all_urls>']};
var post_obj = null;
var net_win; // the output window object

var net_url = chrome.runtime.getURL('blank.html');
var win_properties = {'url': net_url , 'type' : 'popup', 'width' : 800 , 'height' : 700 };

// --- Profile Script Injection ---
let currentProfile = 'casual'; // Default profile

function injectProfileScript(tabId, profile) {
  const scriptFile = `profile_${profile}.js`;
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: [scriptFile]
  }, function() {
    if (chrome.runtime.lastError) {
      console.error('Error injecting profile script:', chrome.runtime.lastError);
    } else {
      console.log(`Successfully injected ${scriptFile} for profile: ${profile}`);
    }
  });
}

// Inject profile script when tab is updated
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    chrome.storage.sync.get(['profile'], function(data) {
      const profile = data.profile || 'casual';
      injectProfileScript(tabId, profile);
    });
  }
});

// Listen for profile changes
chrome.storage.onChanged.addListener(function(changes, area) {
  if (area === 'sync' && 'profile' in changes) {
    currentProfile = changes.profile.newValue || 'casual';
    // Inject new profile script in active tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs[0] && tabs[0].url && tabs[0].url.startsWith('http')) {
        injectProfileScript(tabs[0].id, currentProfile);
      }
    });
  }
});

// --- Ad Blocking Feature ---
const adDomains = [
  'doubleclick.net', 'googlesyndication.com', 'adservice.google.com', 'ads.yahoo.com',
  'adnxs.com', 'adsafeprotected.com', 'advertising.com', 'atdmt.com', 'fastclick.net',
  'moatads.com', 'quantserve.com', 'scorecardresearch.com', 'zedo.com', 'adform.net',
  'outbrain.com', 'taboola.com', 'criteo.com', 'openx.net', 'pubmatic.com', 'rubiconproject.com',
  'serving-sys.com', 'smartadserver.com', 'yieldmo.com', 'yieldlab.net', 'adroll.com', 'bluekai.com'
];

let adBlockEnabled = false;
let adBlockListener = null;

function updateAdsBadge() {
  chrome.storage.local.get(['adsBlocked'], function(data) {
    let count = data.adsBlocked || 0;
    chrome.action.setBadgeText({ text: count > 0 ? count.toString() : '' });
    chrome.action.setBadgeBackgroundColor({ color: '#C3EA21' }); // Brand green
  });
}

// Call on startup
updateAdsBadge();

// Update badge whenever adsBlocked is incremented
function incrementAnalyticsCounter(key) {
  chrome.storage.local.get([key], function(data) {
    let count = data[key] || 0;
    chrome.storage.local.set({ [key]: count + 1 }, function() {
      if (key === 'adsBlocked') updateAdsBadge();
    });
  });
}

function initializeAnalyticsCounters() {
  chrome.storage.local.get(['adsBlocked', 'maliciousSitesBlocked', 'potentialThreatsBlocked'], function(data) {
    if (typeof data.adsBlocked === 'undefined') chrome.storage.local.set({ adsBlocked: 0 });
    if (typeof data.maliciousSitesBlocked === 'undefined') chrome.storage.local.set({ maliciousSitesBlocked: 0 });
    if (typeof data.potentialThreatsBlocked === 'undefined') chrome.storage.local.set({ potentialThreatsBlocked: 0 });
  });
}

initializeAnalyticsCounters();

function updateAdBlockListener() {
  if (adBlockListener) {
    chrome.webRequest.onBeforeRequest.removeListener(adBlockListener);
    adBlockListener = null;
  }
  if (adBlockEnabled) {
    adBlockListener = function(details) {
      const url = details.url;
      for (const domain of adDomains) {
        if (url.includes(domain)) {
          console.log('[AdBlock] Blocking:', url);
          incrementAnalyticsCounter('adsBlocked');
          return { cancel: true };
        }
      }
      console.log('[AdBlock] Allowed:', url);
      return { cancel: false };
    };
    chrome.webRequest.onBeforeRequest.addListener(
      adBlockListener,
      { urls: ["<all_urls>"] },
      ["blocking"]
    );
  }
}

// Initial load
chrome.storage.sync.get(['adBlockEnabled'], function(data) {
  adBlockEnabled = !!data.adBlockEnabled;
  updateAdBlockListener();
});

// Listen for changes
chrome.storage.onChanged.addListener(function(changes, area) {
  if (area === 'sync' && 'adBlockEnabled' in changes) {
    adBlockEnabled = !!changes.adBlockEnabled.newValue;
    updateAdBlockListener();
  }
});

// --- Phishing Protection Feature ---
const phishingDomains = [
  'phishing-example.com', 'malicious-site.com', 'badlogin.com', 'fakebank.com', 'scam-site.org'
  // Add more known phishing domains here
];

let phishingEnabled = false;
let phishingListener = null;

function updatePhishingListener() {
  if (phishingListener) {
    chrome.webRequest.onBeforeRequest.removeListener(phishingListener);
    phishingListener = null;
  }
  if (phishingEnabled) {
    phishingListener = function(details) {
      const url = details.url;
      for (const domain of phishingDomains) {
        if (url.includes(domain)) {
          console.log('[Phishing] Blocking:', url);
          incrementAnalyticsCounter('maliciousSitesBlocked');
          incrementAnalyticsCounter('potentialThreatsBlocked');
          return { cancel: true };
        }
      }
      console.log('[Phishing] Allowed:', url);
      return { cancel: false };
    };
    chrome.webRequest.onBeforeRequest.addListener(
      phishingListener,
      { urls: ["<all_urls>"] },
      ["blocking"]
    );
  }
}

// Initial load
chrome.storage.sync.get(['phishingEnabled'], function(data) {
  phishingEnabled = !!data.phishingEnabled;
  updatePhishingListener();
});

// Listen for changes
chrome.storage.onChanged.addListener(function(changes, area) {
  if (area === 'sync' && 'phishingEnabled' in changes) {
    phishingEnabled = !!changes.phishingEnabled.newValue;
    updatePhishingListener();
  }
});

// --- Malware Protection Feature ---
const malwareDomains = [
  'malwaredomainlist.com', 'malicious-site.net', 'badware.com', 'trojan-site.org', 'virusdomain.co', 'ransomware.com', 'spyware.net', 'rootkit.org', 'keylogger.com', 'botnet.net'
  // Add more known malware domains here
];

let malwareEnabled = false;
let malwareListener = null;

function updateMalwareListener() {
  if (malwareListener) {
    chrome.webRequest.onBeforeRequest.removeListener(malwareListener);
    malwareListener = null;
  }
  if (malwareEnabled) {
    malwareListener = function(details) {
      const url = details.url;
      for (const domain of malwareDomains) {
        if (url.includes(domain)) {
          console.log('[Malware] Blocking:', url);
          incrementAnalyticsCounter('maliciousSitesBlocked');
          incrementAnalyticsCounter('potentialThreatsBlocked');
          return { cancel: true };
        }
      }
      return { cancel: false };
    };
    chrome.webRequest.onBeforeRequest.addListener(
      malwareListener,
      { urls: ["<all_urls>"] },
      ["blocking"]
    );
  }
}

// Initial load
chrome.storage.sync.get(['malwareEnabled'], function(data) {
  malwareEnabled = !!data.malwareEnabled;
  updateMalwareListener();
});

// Listen for changes
chrome.storage.onChanged.addListener(function(changes, area) {
  if (area === 'sync' && 'malwareEnabled' in changes) {
    malwareEnabled = !!changes.malwareEnabled.newValue;
    updateMalwareListener();
  }
});

// --- Cryptojacking Protection Feature ---
const cryptojackingDomains = [
  'coinhive.com', 'cryptoloot.com', 'coinimp.com', 'minero.cc', 'webminerpool.com',
  'coinwebminer.com', 'cryptojacking.com', 'miningpool.com', 'coinminer.com',
  'xmr.pool.gpu', 'pool.minexmr.com', 'xmr.2miners.com', 'cryptonight', 'randomx'
];

let cryptojackingEnabled = false;
let cryptojackingListener = null;

function updateCryptojackingListener() {
  if (cryptojackingListener) {
    chrome.webRequest.onBeforeRequest.removeListener(cryptojackingListener);
    cryptojackingListener = null;
  }
  if (cryptojackingEnabled) {
    cryptojackingListener = function(details) {
      const url = details.url;
      for (const domain of cryptojackingDomains) {
        if (url.includes(domain)) {
          console.log('[Cryptojacking] Blocking:', url);
          incrementAnalyticsCounter('maliciousSitesBlocked');
          incrementAnalyticsCounter('potentialThreatsBlocked');
          return { cancel: true };
        }
      }
      return { cancel: false };
    };
    chrome.webRequest.onBeforeRequest.addListener(
      cryptojackingListener,
      { urls: ["<all_urls>"] },
      ["blocking"]
    );
  }
}

// Initial load for cryptojacking protection
chrome.storage.sync.get(['cryptojackingEnabled'], function(data) {
  cryptojackingEnabled = !!data.cryptojackingEnabled;
  updateCryptojackingListener();
});

// Listen for cryptojacking changes
chrome.storage.onChanged.addListener(function(changes, area) {
  if (area === 'sync' && 'cryptojackingEnabled' in changes) {
    cryptojackingEnabled = !!changes.cryptojackingEnabled.newValue;
    updateCryptojackingListener();
  }
});

function beforeRequest(req_details){
    try{console.log(req_details);}catch(e){}
    if(post_obj) post_obj.postMessage({'type' : 'beforeRequest' , 'req_details' : req_details});
}

function beforeSendHeaders(req_details){
    try{console.log(req_details);}catch(e){}
    if(post_obj) post_obj.postMessage({'type' : 'beforeSendHeaders' , 'req_details' : req_details});
}

function headersReceived(req_details){
    try{console.log(req_details);}catch(e){}
    if(post_obj) post_obj.postMessage({'type' : 'headersReceived' , 'req_details' : req_details});
}

function completed(req_details){
    try{console.log(req_details);}catch(e){}
    if(post_obj) post_obj.postMessage({'type' : 'completed' , 'req_details' : req_details});
}

function errorOccurred(req_details){
    try{console.log(req_details);}catch(e){}
    if(post_obj) post_obj.postMessage({'type' : 'errorOccurred' , 'req_details' : req_details});
}

function setIcon(active) {
    var icon = active ? 'img0001-modified-modified.png' : 'img0001-modified-modified.png';
    chrome.action.setIcon({'path' : icon},function(){});
}

chrome.runtime.onConnect.addListener(function(port) {
    try{console.log(port);}catch(e){}
    console.assert(port.name == "start_listen");
    post_obj = port;
    setIcon(true);
    webRequestListener(true);
    post_obj.onDisconnect.addListener(function(){
        webRequestListener(false);
        setIcon(false);
        net_win = post_obj = null;
    });
});

function webRequestListener(listen){
    chrome.webRequest.onBeforeSendHeaders.removeListener(beforeSendHeaders);
    chrome.webRequest.onHeadersReceived.removeListener(headersReceived);
    chrome.webRequest.onCompleted.removeListener(completed);
    if(listen){
        chrome.webRequest.onBeforeSendHeaders.addListener(beforeSendHeaders,url_filter_obj,["requestHeaders"]);
        chrome.webRequest.onHeadersReceived.addListener(headersReceived,url_filter_obj,["responseHeaders"]);
        chrome.webRequest.onCompleted.addListener(completed,url_filter_obj);
    }
}
setIcon(false);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'incrementAnalytics' && message.key) {
    chrome.storage.local.get([message.key], function(data) {
      let count = data[message.key] || 0;
      chrome.storage.local.set({ [message.key]: count + 1 });
    });
  }
  if (message.action === 'showNotification' && message.title && message.message) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'img0001-modified-modified.png',
      title: message.title,
      message: message.message,
      silent: false
    });
  }
});

chrome.runtime.onInstalled.addListener(function(details) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'img0001-modified-modified.png',
    title: 'Pingfence Enabled',
    message: 'Pingfence has been enabled successfully!',
    silent: false
  });
});

// Also update badge if storage is changed externally (e.g., cleared)
chrome.storage.onChanged.addListener(function(changes, area) {
  if (area === 'local' && changes.adsBlocked) {
    updateAdsBadge();
  }
  // ... existing code ...
}); 