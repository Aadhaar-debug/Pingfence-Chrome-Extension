// Pingfence: Home Profile Content Script

// --- Utility Functions ---
function getDomainFromURL(url) {
    try {
        return new URL(url).hostname.replace(/^www\./, '');
    } catch (e) {
        return '';
    }
}
function blockAdsOnPage() {
	const adSelectors = [
		'[id*="ad" i]', '.ad', '.adsbygoogle', '.sponsored', '[class*="ad-" i]', '[class*="-ad" i]', '[class*="ads" i]', '[data-ad]', '[data-ads]', '[aria-label*="ad" i]', '[aria-label*="sponsored" i]'
	];
	let adsBlocked = 0;
	adSelectors.forEach(selector => {
		document.querySelectorAll(selector).forEach(el => {
			// Only count visible elements
			if (el.offsetParent !== null) {
				el.remove();
				incrementAnalyticsCounter('adsBlocked');
				adsBlocked++;
			}
		});
	});
	return adsBlocked;
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
    const suspiciousKeywords = ['porn', 'sex', 'fuck', 'jizz', 'tinyurl', 'ngrok', 'pirate', 'torrent'];
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
    /porn/i, /sex/i, /fuck/i, /jizz/i
];
const piracyBlacklist = [/pirated/i, /pirate/i, /torrents?/i];
const bankingPhishingBlacklist = [/phish/i, /fakebank/i, /badlogin/i, /scam/i, /fraud/i, /atm/i, /loan/i, /deposit/i, /emi/i, /payment/i, /interest/i, /debit/i, /credit/i, /card/i, /offer/i, /saving/i, /bill/i];

// --- Blocking Logic ---
function incrementAnalyticsCounter(key) {
    chrome.runtime.sendMessage({ action: 'incrementAnalytics', key: key });
}

function theServiceBlocking() {
    const url = window.location.href;
    const domain = getDomainFromURL(url);
    if (isDomainWhitelisted(domain, whitelist)) return;
    if (
        matchesKeywordPatterns(url, adultBlacklist) ||
        matchesKeywordPatterns(url, piracyBlacklist) ||
        isSuspiciousURL(url)
    ) {
        incrementAnalyticsCounter('maliciousSitesBlocked');
        incrementAnalyticsCounter('potentialThreatsBlocked');
        showPingfenceOverlay('Access to this site is not recommended according to your Home profile settings. If you believe this is an error, please adjust your Pingfence settings.');
    }
}

function theBankBlocking() {
    const url = window.location.href;
    const domain = getDomainFromURL(url);
    if (isDomainWhitelisted(domain, whitelist)) return;
    if (matchesKeywordPatterns(url, bankingPhishingBlacklist)) {
        incrementAnalyticsCounter('potentialThreatsBlocked');
        showPingfenceOverlay('This banking or financial site is blocked by your Home profile settings due to potential risk. If you require access, please adjust your Pingfence settings.');
    }
}

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

// Run theServiceBlocking and theBankBlocking for home profile
if (typeof theServiceBlocking == 'function') {
    theServiceBlocking();
}
if (typeof theBankBlocking == 'function') {
    theBankBlocking();
} 
// Run ad blocking on page load
blockAdsOnPage();
// Also run on DOM changes (for dynamically loaded ads)
const observer = new MutationObserver(() => {
	blockAdsOnPage();
});
observer.observe(document.body, { childList: true, subtree: true }); 