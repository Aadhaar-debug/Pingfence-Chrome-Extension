// Pingfence: Focused Profile Content Script
// Designed for distraction-free browsing and productivity

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

// --- Focused Profile Blocking Lists ---
const distractionDomains = [
	// Social Media
	'facebook.com', 'instagram.com', 'twitter.com', 'tiktok.com', 'snapchat.com',
	'reddit.com', 'pinterest.com', 'linkedin.com', 'whatsapp.com', 'telegram.org',
	
	// Video Streaming
	'youtube.com', 'netflix.com', 'hulu.com', 'disneyplus.com', 'amazon.com/prime',
	'twitch.tv', 'vimeo.com', 'dailymotion.com', 'bilibili.com',
	
	// Gaming
	'roblox.com', 'minecraft.net', 'steam.com', 'epicgames.com', 'playstation.com',
	'xbox.com', 'nintendo.com', 'gamepedia.com', 'ign.com', 'gamespot.com',
	
	// Shopping
	'amazon.com', 'ebay.com', 'etsy.com', 'aliexpress.com', 'wish.com',
	'taobao.com', 'jd.com', 'flipkart.com', 'shopify.com',
	
	// News/Entertainment
	'buzzfeed.com', 'vice.com', 'vox.com', 'huffpost.com', 'dailymail.co.uk',
	'tmz.com', 'people.com', 'usmagazine.com', 'eonline.com',
	
	// Adult Content
	'pornhub.com', 'xvideos.com', 'xnxx.com', 'redtube.com', 'youporn.com',
	'brazzers.com', 'playboy.com', 'adultfriendfinder.com',
	
	// Gambling
	'bet365.com', 'pokerstars.com', '888casino.com', 'williamhill.com',
	'ladbrokes.com', 'bwin.com', 'unibet.com', 'casumo.com'
];

const productivityWhitelist = [
	// Search Engines
	'google.com', 'bing.com', 'duckduckgo.com', 'yahoo.com', 'baidu.com',
	
	// Productivity Tools
	'notion.so', 'evernote.com', 'onenote.com', 'trello.com', 'asana.com',
	'monday.com', 'slack.com', 'discord.com', 'zoom.us', 'teams.microsoft.com',
	'calendar.google.com', 'drive.google.com', 'dropbox.com', 'box.com',
	
	// Development
	'github.com', 'gitlab.com', 'stackoverflow.com', 'stackexchange.com',
	'w3schools.com', 'mdn.web', 'dev.to', 'medium.com', 'css-tricks.com',
	'codepen.io', 'jsfiddle.net', 'replit.com', 'glitch.com',
	
	// Documentation
	'wikipedia.org', 'docs.microsoft.com', 'developer.mozilla.org',
	'nodejs.org', 'python.org', 'java.com', 'oracle.com',
	
	// Email
	'gmail.com', 'outlook.com', 'yahoo.com/mail', 'protonmail.com',
	
	// Educational
	'coursera.org', 'udemy.com', 'edx.org', 'khanacademy.org',
	'brilliant.org', 'codecademy.com', 'freecodecamp.org',
	
	// Business
	'salesforce.com', 'hubspot.com', 'zendesk.com', 'intercom.com',
	'stripe.com', 'paypal.com', 'square.com', 'quickbooks.com'
];

// --- Focused Profile Blocking Logic ---
function focusedProfileBlocking() {
	const url = window.location.href;
	const domain = getDomainFromURL(url);
	
	// Check if domain is in distraction list
	if (distractionDomains.some(d => domain.includes(d))) {
		incrementAnalyticsCounter('maliciousSitesBlocked');
		incrementAnalyticsCounter('potentialThreatsBlocked');
		showFocusedOverlay('This site has been blocked to help you stay focused. Switch to a different profile if you need access.');
		return;
	}
	
	// Allow productivity sites
	if (productivityWhitelist.some(d => domain.includes(d))) {
		return;
	}
	
	// For other sites, apply distraction blocking
	blockDistractions();
}

function showFocusedOverlay(message) {
	var existing = document.getElementById('pingfence-focused-overlay');
	if (existing) existing.remove();
	
	var overlay = document.createElement('div');
	overlay.id = 'pingfence-focused-overlay';
	overlay.style.position = 'fixed';
	overlay.style.top = '0';
	overlay.style.left = '0';
	overlay.style.width = '100vw';
	overlay.style.height = '100vh';
	overlay.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
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
	box.style.boxShadow = '0 8px 40px rgba(0,0,0,0.3)';
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
	title.textContent = 'Stay Focused! 🎯';
	title.style.margin = '0 0 16px 0';
	title.style.fontSize = '1.8em';
	title.style.color = '#667eea';
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
	btn.textContent = 'Back to Productivity';
	btn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
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

function blockDistractions() {
	let distractionsBlocked = 0;
	
	// Block autoplay videos and audio
	document.querySelectorAll('video, audio').forEach(media => {
		media.pause();
		media.muted = true;
		media.style.display = 'none';
		distractionsBlocked++;
	});
	
	// Block notification prompts
	document.querySelectorAll('[class*="notification"], [id*="notification"], [class*="popup"], [id*="popup"]').forEach(el => {
		if (el.offsetParent !== null && !el.closest('.pingfence-focused-overlay')) {
			el.style.display = 'none';
			distractionsBlocked++;
		}
	});
	
	// Block social media widgets
	document.querySelectorAll('[class*="social"], [id*="social"], [class*="share"], [id*="share"], .fb-like, .twitter-share-button').forEach(el => {
		el.style.display = 'none';
		distractionsBlocked++;
	});
	
	// Block chat widgets
	document.querySelectorAll('[class*="chat"], [id*="chat"], [class*="messenger"], [id*="messenger"], .intercom, .zendesk').forEach(el => {
		el.style.display = 'none';
		distractionsBlocked++;
	});
	
	// Block autoplay and redirect scripts
	const scripts = document.querySelectorAll('script');
	scripts.forEach(script => {
		const content = script.textContent || script.innerHTML;
		if (content.includes('autoplay') || content.includes('window.location') || content.includes('redirect')) {
			script.remove();
			distractionsBlocked++;
		}
	});
	
	// Block music players and audio controls
	document.querySelectorAll('[class*="player"], [id*="player"], [class*="audio"], [id*="audio"], [class*="music"], [id*="music"]').forEach(el => {
		if (el.offsetParent !== null) {
			el.style.display = 'none';
			distractionsBlocked++;
		}
	});
	
	// Block countdown timers and urgency elements
	document.querySelectorAll('[class*="countdown"], [id*="countdown"], [class*="timer"], [id*="timer"], [class*="urgent"], [id*="urgent"]').forEach(el => {
		el.style.display = 'none';
		distractionsBlocked++;
	});
	
	// Block floating elements and overlays
	document.querySelectorAll('[style*="position: fixed"], [style*="position:fixed"], [class*="floating"], [id*="floating"]').forEach(el => {
		if (!el.closest('.pingfence-focused-overlay')) {
			el.style.display = 'none';
			distractionsBlocked++;
		}
	});
	
	// Block ads (enhanced for focused mode)
	const adSelectors = [
		'[id*="ad" i]', '.ad', '.adsbygoogle', '.sponsored', '[class*="ad-" i]', 
		'[class*="-ad" i]', '[class*="ads" i]', '[data-ad]', '[data-ads]', 
		'[aria-label*="ad" i]', '[aria-label*="sponsored" i]', '[class*="banner"]',
		'[id*="banner"]', '[class*="promo"]', '[id*="promo"]'
	];
	
	adSelectors.forEach(selector => {
		document.querySelectorAll(selector).forEach(el => {
			if (el.offsetParent !== null) {
				el.remove();
				incrementAnalyticsCounter('adsBlocked');
				distractionsBlocked++;
			}
		});
	});
	
	return distractionsBlocked;
}

// Prevent page redirects
let redirectAttempts = 0;
const originalLocation = window.location.href;

// Override location changes
Object.defineProperty(window, 'location', {
	get: function() {
		return {
			href: originalLocation,
			replace: function(url) {
				if (redirectAttempts < 3) {
					redirectAttempts++;
					showFocusedOverlay('Redirect blocked to maintain focus. Stay on the current page.');
				}
			},
			assign: function(url) {
				if (redirectAttempts < 3) {
					redirectAttempts++;
					showFocusedOverlay('Redirect blocked to maintain focus. Stay on the current page.');
				}
			}
		};
	},
	set: function(url) {
		if (redirectAttempts < 3) {
			redirectAttempts++;
			showFocusedOverlay('Redirect blocked to maintain focus. Stay on the current page.');
		}
	}
});

// Block beforeunload events that might show exit prompts
window.addEventListener('beforeunload', function(e) {
	e.preventDefault();
	e.returnValue = '';
});

// Run focused profile blocking
if (typeof focusedProfileBlocking === 'function') {
	focusedProfileBlocking();
}

// Run distraction blocking on page load
blockDistractions();

// Monitor for dynamically loaded distractions
const observer = new MutationObserver(() => {
	blockDistractions();
});

observer.observe(document.body, { 
	childList: true, 
	subtree: true,
	attributes: true,
	attributeFilter: ['style', 'class']
}); 