// Pingfence: Hardened Security Profile Content Script
// Advanced protection with comprehensive security features

// --- Utility Functions ---
function getDomainFromURL(url) {
	try {
		return new URL(url).hostname.replace(/^www\./, '');
	} catch (e) {
		return '';
	}
}

function incrementAnalyticsCounter(key) {
	chrome.runtime.sendMessage({ action: 'incrementAnalytics', key: key });
}

function isObfuscatedKeyword(text, keyword) {
	const obfuscated = keyword.replace(/o/g, '[o0]').replace(/i/g, '[i1!]').replace(/e/g, '[e3]').replace(/a/g, '[a@4]').replace(/s/g, '[s5$]');
	const regex = new RegExp(obfuscated, 'i');
	return regex.test(text);
}

function isSuspiciousURL(url) {
	const suspiciousKeywords = ['porn', 'sex', 'fuck', 'jizz', 'tinyurl', 'ngrok', 'pirate', 'torrent', 'crack', 'hack', 'warez', 'keygen'];
	for (let kw of suspiciousKeywords) {
		if (isObfuscatedKeyword(url, kw)) return true;
	}
	return false;
}

// --- Hardened Security Blocking Lists ---
const malwareDomains = [
	// Known malware distribution sites
	'cracked.to', 'nulled.to', 'warez-bb.org', 'cracked-games.org', 'keygen.us',
	'warez.com', 'cracked.com', 'keygen.net', 'serialz.to', 'crackdb.com',
	'warezbb.org', 'crackedgames.org', 'keygens.us', 'serialz.net', 'crackdb.net',
	
	// Cryptojacking domains
	'coinhive.com', 'cryptoloot.com', 'coinimp.com', 'minero.cc', 'webminerpool.com',
	'coinwebminer.com', 'cryptojacking.com', 'miningpool.com', 'coinminer.com',
	
	// Phishing domains
	'paypa1.com', 'g00gle.com', 'faceb00k.com', 'amaz0n.com', 'ebay-secure.com',
	'paypal-secure.com', 'google-secure.com', 'facebook-secure.com',
	
	// Deep web/onion domains (attempts)
	'.onion', 'tor2web.org', 'onion.to', 'onion.link', 'onion.cab',
	
	// Suspicious TLDs
	'.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.club', '.work'
];

const blacklistedSoftware = [
	// Piracy tools
	'utorrent', 'bittorrent', 'qtorrent', 'transmission', 'deluge',
	'vuze', 'frostwire', 'limewire', 'kazaa', 'emule',
	
	// Cracking tools
	'ollydbg', 'ida pro', 'x64dbg', 'cheat engine', 'artmoney',
	'gamehack', 'trainer', 'crack', 'keygen', 'serial',
	
	// Malware tools
	'rat', 'trojan', 'backdoor', 'keylogger', 'spyware',
	'rootkit', 'botnet', 'ddos', 'exploit', 'payload'
];

const deepWebPatterns = [
	// Dark web indicators
	/\.onion$/i, /tor2web/i, /hidden\.service/i, /darknet/i, /deepweb/i,
	/silkroad/i, /alphabay/i, /hansa/i, /dream/i, /wallstreet/i,
	
	// Cryptocurrency mixing services
	/tumbler/i, /mixer/i, /laundry/i, /anonymizer/i,
	
	// Illegal marketplaces
	/marketplace/i, /vendor/i, /dread/i, /empire/i
];

const cryptojackingPatterns = [
	// Mining scripts
	/coinhive/i, /cryptoloot/i, /coinimp/i, /minero/i, /webminerpool/i,
	/coinwebminer/i, /cryptojacking/i, /miningpool/i, /coinminer/i,
	
	// Mining algorithms
	/cryptonight/i, /randomx/i, /ethash/i, /kawpow/i,
	
	// Mining pools
	/xmr\.pool\.gpu/i, /pool\.minexmr\.com/i, /xmr\.2miners\.com/i
];

// --- Advanced Security Features ---
function hardenedSecurityBlocking() {
	const url = window.location.href;
	const domain = getDomainFromURL(url);
	
	// Check for malware domains
	if (malwareDomains.some(d => domain.includes(d))) {
		incrementAnalyticsCounter('maliciousSitesBlocked');
		incrementAnalyticsCounter('potentialThreatsBlocked');
		showHardenedOverlay('Access blocked: This domain is known for malware distribution or malicious activities.');
		return;
	}
	
	// Check for deep web patterns
	if (deepWebPatterns.some(pattern => pattern.test(url))) {
		incrementAnalyticsCounter('maliciousSitesBlocked');
		incrementAnalyticsCounter('potentialThreatsBlocked');
		showHardenedOverlay('Access blocked: Deep web/dark web content detected. This content is restricted for your security.');
		return;
	}
	
	// Check for suspicious URLs
	if (isSuspiciousURL(url)) {
		incrementAnalyticsCounter('maliciousSitesBlocked');
		incrementAnalyticsCounter('potentialThreatsBlocked');
		showHardenedOverlay('Access blocked: Suspicious URL patterns detected. This may be a phishing or malicious site.');
		return;
	}
	
	// Apply advanced protection measures
	blockCryptojackingScripts();
	blockMaliciousScripts();
	blockSuspiciousElements();
	enhancedAdBlocking();
	blockTrackingScripts();
	protectPersonalData();
}

function showHardenedOverlay(message) {
	var existing = document.getElementById('pingfence-hardened-overlay');
	if (existing) existing.remove();
	
	var overlay = document.createElement('div');
	overlay.id = 'pingfence-hardened-overlay';
	overlay.style.position = 'fixed';
	overlay.style.top = '0';
	overlay.style.left = '0';
	overlay.style.width = '100vw';
	overlay.style.height = '100vh';
	overlay.style.background = 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)';
	overlay.style.zIndex = '999999';
	overlay.style.display = 'flex';
	overlay.style.flexDirection = 'column';
	overlay.style.justifyContent = 'center';
	overlay.style.alignItems = 'center';
	overlay.style.fontFamily = 'Segoe UI, Arial, sans-serif';
	
	var box = document.createElement('div');
	box.style.background = '#fff';
	box.style.padding = '40px 50px';
	box.style.borderRadius = '16px';
	box.style.boxShadow = '0 8px 40px rgba(0,0,0,0.4)';
	box.style.textAlign = 'center';
	box.style.maxWidth = '90vw';
	box.style.maxHeight = '80vh';
	box.style.overflow = 'auto';
	
	var logo = document.createElement('img');
	logo.src = chrome.runtime.getURL('img0001-modified-modified.png');
	logo.alt = 'Pingfence Logo';
	logo.style.width = '72px';
	logo.style.marginBottom = '20px';
	box.appendChild(logo);
	
	var title = document.createElement('h2');
	title.textContent = '🚨 Security Alert!';
	title.style.margin = '0 0 16px 0';
	title.style.fontSize = '1.8em';
	title.style.color = '#d32f2f';
	title.style.fontWeight = '600';
	box.appendChild(title);
	
	var msg = document.createElement('div');
	msg.textContent = message;
	msg.style.fontSize = '1.2em';
	msg.style.color = '#333';
	msg.style.marginBottom = '28px';
	msg.style.lineHeight = '1.5';
	box.appendChild(msg);
	
	var btn = document.createElement('button');
	btn.textContent = 'Return to Safety';
	btn.style.background = 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)';
	btn.style.color = '#fff';
	btn.style.border = 'none';
	btn.style.borderRadius = '8px';
	btn.style.padding = '14px 36px';
	btn.style.fontSize = '1.1em';
	btn.style.cursor = 'pointer';
	btn.style.fontWeight = '500';
	btn.style.transition = 'transform 0.2s';
	btn.onmouseover = function() { this.style.transform = 'scale(1.05)'; };
	btn.onmouseout = function() { this.style.transform = 'scale(1)'; };
	btn.onclick = function() {
		window.location.replace('https://www.google.com');
	};
	box.appendChild(btn);
	
	overlay.appendChild(box);
	document.body.appendChild(overlay);
}

function blockCryptojackingScripts() {
	let cryptojackingBlocked = 0;
	
	// Block known cryptojacking scripts
	const cryptoScripts = document.querySelectorAll('script[src*="coinhive"], script[src*="cryptoloot"], script[src*="coinimp"]');
	cryptoScripts.forEach(script => {
		script.remove();
		cryptojackingBlocked++;
		incrementAnalyticsCounter('potentialThreatsBlocked');
	});
	
	// Block inline cryptojacking code
	const allScripts = document.querySelectorAll('script');
	allScripts.forEach(script => {
		const content = script.textContent || script.innerHTML;
		if (cryptojackingPatterns.some(pattern => pattern.test(content))) {
			script.remove();
			cryptojackingBlocked++;
			incrementAnalyticsCounter('potentialThreatsBlocked');
		}
	});
	
	// Block WebAssembly modules (common for crypto mining)
	const wasmScripts = document.querySelectorAll('script[type="application/wasm"]');
	wasmScripts.forEach(script => {
		script.remove();
		cryptojackingBlocked++;
		incrementAnalyticsCounter('potentialThreatsBlocked');
	});
	
	return cryptojackingBlocked;
}

function blockMaliciousScripts() {
	let maliciousBlocked = 0;
	
	// Block scripts with suspicious patterns
	const allScripts = document.querySelectorAll('script');
	allScripts.forEach(script => {
		const content = script.textContent || script.innerHTML;
		const src = script.src || '';
		
		// Check for blacklisted software patterns
		if (blacklistedSoftware.some(software => 
			content.toLowerCase().includes(software) || src.toLowerCase().includes(software)
		)) {
			script.remove();
			maliciousBlocked++;
			incrementAnalyticsCounter('potentialThreatsBlocked');
		}
		
		// Check for obfuscated code patterns
		if (content.includes('eval(') || content.includes('Function(') || 
			content.includes('document.write(') || content.includes('innerHTML')) {
			script.remove();
			maliciousBlocked++;
			incrementAnalyticsCounter('potentialThreatsBlocked');
		}
	});
	
	return maliciousBlocked;
}

function blockSuspiciousElements() {
	let suspiciousBlocked = 0;
	
	// Block iframes (common attack vector)
	document.querySelectorAll('iframe').forEach(iframe => {
		const src = iframe.src || '';
		if (src.includes('.onion') || src.includes('tor2web') || 
			src.includes('coinhive') || src.includes('cryptoloot')) {
			iframe.remove();
			suspiciousBlocked++;
			incrementAnalyticsCounter('potentialThreatsBlocked');
		}
	});
	
	// Block suspicious forms (phishing attempts)
	document.querySelectorAll('form').forEach(form => {
		const action = form.action || '';
		const inputs = form.querySelectorAll('input[type="password"], input[name*="password"], input[name*="passwd"]');
		
		if (inputs.length > 0 && (action.includes('paypa1') || action.includes('g00gle') || 
			action.includes('faceb00k') || action.includes('amaz0n'))) {
			form.style.display = 'none';
			suspiciousBlocked++;
			incrementAnalyticsCounter('potentialThreatsBlocked');
		}
	});
	
	return suspiciousBlocked;
}

function enhancedAdBlocking() {
	let adsBlocked = 0;
	
	// Enhanced ad selectors for hardened mode
	const adSelectors = [
		'[id*="ad" i]', '.ad', '.adsbygoogle', '.sponsored', '[class*="ad-" i]', 
		'[class*="-ad" i]', '[class*="ads" i]', '[data-ad]', '[data-ads]', 
		'[aria-label*="ad" i]', '[aria-label*="sponsored" i]', '[class*="banner"]',
		'[id*="banner"]', '[class*="promo"]', '[id*="promo"]', '[class*="popup"]',
		'[id*="popup"]', '[class*="overlay"]', '[id*="overlay"]', '[class*="modal"]',
		'[id*="modal"]', '[class*="lightbox"]', '[id*="lightbox"]'
	];
	
	adSelectors.forEach(selector => {
		document.querySelectorAll(selector).forEach(el => {
			if (el.offsetParent !== null) {
				el.remove();
				incrementAnalyticsCounter('adsBlocked');
				adsBlocked++;
			}
		});
	});
	
	return adsBlocked;
}

function blockTrackingScripts() {
	let trackingBlocked = 0;
	
	// Block common tracking scripts
	const trackingPatterns = [
		'google-analytics', 'gtag', 'googletagmanager', 'facebook.net',
		'twitter.com/widgets', 'linkedin.com/trk', 'pinterest.com/pin',
		'hotjar', 'mixpanel', 'amplitude', 'segment', 'heap'
	];
	
	const allScripts = document.querySelectorAll('script');
	allScripts.forEach(script => {
		const src = script.src || '';
		if (trackingPatterns.some(pattern => src.includes(pattern))) {
			script.remove();
			trackingBlocked++;
		}
	});
	
	return trackingBlocked;
}

function protectPersonalData() {
	// Mask email addresses
	document.querySelectorAll('*').forEach(element => {
		if (element.textContent) {
			const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
			element.textContent = element.textContent.replace(emailRegex, '[EMAIL PROTECTED]');
		}
	});
	
	// Mask phone numbers
	document.querySelectorAll('*').forEach(element => {
		if (element.textContent) {
			const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
			element.textContent = element.textContent.replace(phoneRegex, '[PHONE PROTECTED]');
		}
	});
	
	// Block clipboard access
	document.addEventListener('copy', function(e) {
		e.preventDefault();
		return false;
	});
	
	// Block right-click context menu
	document.addEventListener('contextmenu', function(e) {
		e.preventDefault();
		return false;
	});
}

// --- Advanced URL Shortener Detection ---
function detectURLShorteners() {
	const url = window.location.href;
	const shortenerDomains = [
		'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'is.gd', 'v.gd',
		'ow.ly', 'su.pr', 'twurl.nl', 'snipurl.com', 'short.to',
		'BudURL.com', 'ping.fm', 'tr.im', 'snipr.com', 'short.ie',
		'kl.am', 'wp.me', 'rubyurl.com', 'om.ly', 'to.ly', 'bit.do'
	];
	
	if (shortenerDomains.some(domain => url.includes(domain))) {
		showHardenedOverlay('URL Shortener detected! These can be used to hide malicious destinations. Proceed with caution.');
	}
}

// --- Run Hardened Security Protection ---
if (typeof hardenedSecurityBlocking === 'function') {
	hardenedSecurityBlocking();
}

// Run all protection functions
blockCryptojackingScripts();
blockMaliciousScripts();
blockSuspiciousElements();
enhancedAdBlocking();
blockTrackingScripts();
protectPersonalData();
detectURLShorteners();

// Monitor for dynamically loaded threats
const observer = new MutationObserver(() => {
	blockCryptojackingScripts();
	blockMaliciousScripts();
	blockSuspiciousElements();
	enhancedAdBlocking();
	blockTrackingScripts();
});

observer.observe(document.body, { 
	childList: true, 
	subtree: true,
	attributes: true,
	attributeFilter: ['src', 'href', 'action']
});

// Block WebSocket connections to suspicious domains
const originalWebSocket = window.WebSocket;
window.WebSocket = function(url, protocols) {
	if (url.includes('.onion') || url.includes('coinhive') || url.includes('cryptoloot')) {
		throw new Error('WebSocket connection blocked for security');
	}
	return new originalWebSocket(url, protocols);
};

// Block fetch requests to suspicious domains
const originalFetch = window.fetch;
window.fetch = function(url, options) {
	if (typeof url === 'string' && (url.includes('.onion') || url.includes('coinhive') || url.includes('cryptoloot'))) {
		throw new Error('Fetch request blocked for security');
	}
	return originalFetch(url, options);
};
