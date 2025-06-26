// Pingfence: Professional Profile Content Script

// --- Utility Functions ---
function getDomainFromURL(url) {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch (e) {
        return '';
    }
}

function isDomainBlacklisted(domain, blacklist) {
    return blacklist.some(pattern => domain.endsWith(pattern));
}

function isDomainWhitelisted(domain, whitelist) {
    return whitelist.some(pattern => domain.endsWith(pattern));
}

function matchesKeywordPatterns(text, patterns) {
    return patterns.some(pattern => pattern.test(text));
}

function isObfuscatedKeyword(text, keyword) {
    // e.g. p0rn, pr0n, s3x, etc.
    const obfuscated = keyword.replace(/o/g, '[o0]').replace(/i/g, '[i1!]').replace(/e/g, '[e3]').replace(/a/g, '[a@4]').replace(/s/g, '[s5$]');
    const regex = new RegExp(obfuscated, 'i');
    return regex.test(text);
}

function isSuspiciousURL(url) {
    // Detect encoded/obfuscated keywords in URL
    const suspiciousKeywords = ['porn', 'sex', 'fuck', 'jizz', 'tinyurl', 'ngrok', 'pirate', 'torrent', 'game', 'music', 'proxy', 'vpn', 'darkweb'];
    for (let kw of suspiciousKeywords) {
        if (isObfuscatedKeyword(url, kw)) return true;
    }
    return false;
}

// --- Lists ---
const whitelist = [
    'google.com', 'baidu.com', 'yahoo.', 'drive.google.com', 'linkedin.com',
    'amazon.', 'wikipedia.com', 'twitter.com', 'taobao.com', 'live.com', 'yandex.ru', 'vk.com', 'bing.com', 't.co',
    'msn.com', 'aliexpress.', 'ask.com', 'cssbattle.com', 'whatsapp.com',
    'bankofindia', 'bankofmaharashtra', 'ucobank', 'unionofindia', 'nabard.org', 'dohabank.co.in', 'emirates.ndb.co.in',
    'centralbankofindia', 'pnbindia', 'onlinesbi', 'axisbank', 'hdfcbank', 'icicibank', 'jkbank', 'yesbank', 'Bank of Baroda',
    'bandhanbank', 'csb.co.in', 'cityunionbank', 'dcbbank', 'dhanbank', 'federalbank.co.in', 'indusind.com', 'rblbank',
    'fincarebank', 'airtel.in/bank', 'hackerearth.com', 'hackerrank.com', 'wordpress.com', 'reddit.com', 'mail.ru',
    'go.com', 'stackoverflow.com', 'alibaba.com', 'craiglist.org', 'blogger.com', 'blogspot.com', 'cnn.com', 'bbc.co.uk', 'dropbox.com'
];

const adultBlacklist = [
    /porn/i, /sex/i, /fuck/i, /jizz/i, /darkweb/i, /torbrowser/i, /tor/i, /tinyurl/i, /ngrok/i
];
const piracyBlacklist = [/pirated/i, /pirate/i, /torrents?/i];
const entertainmentBlacklist = [/game/i, /music/i, /fashion/i, /sports/i];
const proxyBlacklist = [/proxy/i, /vpn/i];

const socialBlacklist = [
    /pinterest/i, /twitter/i, /vimeo/i, /facebook/i, /instagram/i, /youtube/i, /yubo/i, /line/i, /tiktok/i, /telegram/i, /snapchat/i, /wish/i, /skype/i, /discord/i, /yelp/i, /wechat/i, /clubhouse/i, /twitch/i, /patreon/i, /substack/i, /reddit/i, /public/i, /triller/i, /trello/i, /bereal/i, /mcaffeine/i, /periscope/i, /tagged/i, /valence/i, /intapped/i, /elpha/i, /peanut/i, /houseparty/i, /steemit/i, /23snaps/i, /likee/i, /band/i, /bebee/i, /tumblr/i, /mix/i, /flickr/i, /supernova/i, /locket/i, /sunroom/i, /pearpop/i
];

// --- Blocking Logic ---
function theServiceBlocking() {
    const url = window.location.href;
    const domain = getDomainFromURL(url);
    if (isDomainWhitelisted(domain, whitelist)) return;
    if (
        matchesKeywordPatterns(url, adultBlacklist) ||
        matchesKeywordPatterns(url, piracyBlacklist) ||
        matchesKeywordPatterns(url, entertainmentBlacklist) ||
        matchesKeywordPatterns(url, proxyBlacklist) ||
        isSuspiciousURL(url)
    ) {
        ShowNotificationForSreviceSites();
        blockAccessforrestrictedservices();
    }
}

function theSocialBlocking() {
    const url = window.location.href;
    const domain = getDomainFromURL(url);
    if (isDomainWhitelisted(domain, whitelist)) return;
    if (matchesKeywordPatterns(url, socialBlacklist)) {
        ShowNotificationForSocialMediaSites();
        blockAccessforsocialmediasites();
    }
}

// --- Overlay Notification (already implemented) ---
function showPingfenceOverlay(message) {
    var existing = document.getElementById('pingfence-block-overlay');
    if (existing) existing.remove();
    var overlay = document.createElement('div');
    overlay.id = 'pingfence-block-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.85)';
    overlay.style.zIndex = '999999';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.fontFamily = 'Segoe UI, Arial, sans-serif';
    var box = document.createElement('div');
    box.style.background = '#fff';
    box.style.padding = '32px 40px';
    box.style.borderRadius = '12px';
    box.style.boxShadow = '0 4px 32px rgba(0,0,0,0.2)';
    box.style.textAlign = 'center';
    box.style.maxWidth = '90vw';
    box.style.maxHeight = '80vh';
    box.style.overflow = 'auto';
    var logo = document.createElement('img');
    logo.src = chrome.runtime.getURL('img0001-modified-modified.png');
    logo.alt = 'Pingfence Logo';
    logo.style.width = '64px';
    logo.style.marginBottom = '18px';
    box.appendChild(logo);
    var title = document.createElement('h2');
    title.textContent = 'Site Access Restricted';
    title.style.margin = '0 0 12px 0';
    title.style.fontSize = '1.6em';
    title.style.color = '#1a237e';
    box.appendChild(title);
    var msg = document.createElement('div');
    msg.textContent = message;
    msg.style.fontSize = '1.1em';
    msg.style.color = '#333';
    msg.style.marginBottom = '24px';
    box.appendChild(msg);
    var btn = document.createElement('button');
    btn.textContent = 'Go Back';
    btn.style.background = '#1a237e';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '6px';
    btn.style.padding = '12px 32px';
    btn.style.fontSize = '1em';
    btn.style.cursor = 'pointer';
    btn.onclick = function() {
        window.location.replace('https://www.google.com');
    };
    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

function incrementAnalyticsCounter(key) {
    chrome.runtime.sendMessage({ action: 'incrementAnalytics', key: key });
}

function blockAccessforrestrictedservices() { 
    console.log("Pingfence: Site blocked by Professional profile.");
    incrementAnalyticsCounter('maliciousSitesBlocked');
    incrementAnalyticsCounter('potentialThreatsBlocked');
    showPingfenceOverlay('Access to this site is restricted by your Professional profile settings. If you believe this is an error, please contact your administrator or adjust your Pingfence settings.');
}

function blockAccessforsocialmediasites() { 
    console.log("Pingfence: Social media site blocked by Professional profile.");
    incrementAnalyticsCounter('potentialThreatsBlocked');
    showPingfenceOverlay('Access to social media sites is restricted by your Professional profile settings. If you require access, please contact your administrator or adjust your Pingfence settings.');
}

function ShowNotificationForSreviceSites() {
	const notificationtwo = new Notification("⚠️ Internet Security Warning !!!", {
	   body: "The site may carry potentially malicious sources . Click here to secure yourself.",
	   icon: "img0001-modified-modified.png"
	})
	notificationtwo.onclick = (event) => {
		event.preventDefault();
		function ShowNotificationForSreviceSites() {
			const notificationtwo = new Notification("✅ You are safe now !!!", {
			   body: "We have discarded the site for you . You can start fresh . Happy surfing !!! ",
			   icon: "img0001-modified-modified.png"
			})
		 }
		function Replace() 
		{
			location.replace("https://google.com")
			ShowNotificationForSreviceSites()
	    }
	   Replace()
	  }
}

function ShowNotificationForSocialMediaSites() {
	const notification4 = new Notification("⚠️ Internet Security Warning !!!", {
	   body: "The site may carry potentially malicious sources . Click here to secure yourself.",
	   icon: "img0001-modified-modified.png"
	})
	notification4.onclick = (event) => {
		event.preventDefault();
		function ShowNotificationForSocialMediaSites() {
			const notification5 = new Notification("✅ You are safe now !!!", {
			   body: "We have discarded the site for you . You can start fresh . Happy surfing !!! ",
			   icon: "img0001-modified-modified.png"
			})
		 }
		function Replace() 
		{
			location.replace("https://google.com")
			ShowNotificationForSocialMediaSites()
	    }
	   Replace()
	  }
}

function detectURLShorteners() {
  const url = window.location.href;
  const shortenerDomains = [
    'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'is.gd', 'v.gd',
    'ow.ly', 'su.pr', 'twurl.nl', 'snipurl.com', 'short.to',
    'BudURL.com', 'ping.fm', 'tr.im', 'snipr.com', 'short.ie',
    'kl.am', 'wp.me', 'rubyurl.com', 'om.ly', 'to.ly', 'bit.do'
  ];
  if (shortenerDomains.some(domain => url.includes(domain))) {
    chrome.runtime.sendMessage({
      action: 'showNotification',
      title: 'URL Shortener Detected',
      message: 'This link uses a URL shortener. Proceed with caution as these can hide malicious destinations.'
    });
  }
}

detectURLShorteners();

const observer = new MutationObserver(() => {
  detectURLShorteners();
});
observer.observe(document.body, { childList: true, subtree: true });

// Run theServiceBlocking and theSocialBlocking for professional profile
if (typeof theServiceBlocking == 'function') {
    theServiceBlocking();
}
if (typeof theSocialBlocking == 'function') {
    theSocialBlocking();
} 