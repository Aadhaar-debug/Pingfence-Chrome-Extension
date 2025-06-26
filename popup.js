// Feature toggles logic
function loadFeatureToggles() {
  chrome.storage.sync.get(['adBlockEnabled', 'phishingEnabled', 'malwareEnabled', 'cryptojackingEnabled', 'profile'], function(data) {
    document.getElementById('adBlockToggle').checked = !!data.adBlockEnabled;
    document.getElementById('phishingToggle').checked = !!data.phishingEnabled;
    document.getElementById('malwareToggle').checked = !!data.malwareEnabled;
    document.getElementById('cryptojackingToggle').checked = !!data.cryptojackingEnabled;
    // Set profile radio
    if (data.profile) {
      document.getElementById('profile' + capitalize(data.profile)).checked = true;
    } else {
      document.getElementById('profileCasual').checked = true; // Default
    }
  });
}

function loadAnalytics() {
  chrome.storage.local.get(['maliciousSitesBlocked', 'adsBlocked', 'potentialThreatsBlocked'], function(data) {
    document.getElementById('analyticsMalicious').textContent = data.maliciousSitesBlocked || 0;
    document.getElementById('analyticsAds').textContent = data.adsBlocked || 0;
    document.getElementById('analyticsThreats').textContent = data.potentialThreatsBlocked || 0;
  });
}

document.addEventListener('DOMContentLoaded', function() {
  loadFeatureToggles();
  loadAnalytics();
  document.getElementById('adBlockToggle').addEventListener('change', function() {
    chrome.storage.sync.set({ adBlockEnabled: this.checked }, function() {
      alert('Ad Blocking has been ' + (document.getElementById('adBlockToggle').checked ? 'enabled' : 'disabled') + '.');
    });
  });
  document.getElementById('phishingToggle').addEventListener('change', function() {
    chrome.storage.sync.set({ phishingEnabled: this.checked }, function() {
      alert('Phishing Protection has been ' + (document.getElementById('phishingToggle').checked ? 'enabled' : 'disabled') + '.');
    });
  });
  document.getElementById('malwareToggle').addEventListener('change', function() {
    chrome.storage.sync.set({ malwareEnabled: this.checked }, function() {
      alert('Malware Protection has been ' + (document.getElementById('malwareToggle').checked ? 'enabled' : 'disabled') + '.');
    });
  });
  document.getElementById('cryptojackingToggle').addEventListener('change', function() {
    chrome.storage.sync.set({ cryptojackingEnabled: this.checked }, function() {
      alert('Cryptojacking Protection has been ' + (document.getElementById('cryptojackingToggle').checked ? 'enabled' : 'disabled') + '.');
    });
  });
  // Profile radio logic
  document.querySelectorAll('input[name="profile"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
      if (this.checked) {
        chrome.storage.sync.set({ profile: this.value }, function() {
          alert('Profile set to ' + capitalize(radio.value));
          // Inject the appropriate content script for the selected profile
          injectProfileScript(this.value);
        }.bind(this));
      }
    });
  });
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Function to inject the appropriate profile content script
function injectProfileScript(profile) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (tabs[0]) {
      const scriptFile = 'profile_' + profile + '.js';
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        files: [scriptFile]
      }).catch(function(error) {
        console.log('Script injection error:', error);
      });
    }
  });
}

// Remove Dashboard and Parsley URLs buttons
document.getElementById('parsleyBtn').addEventListener('click', function() {
  chrome.windows.create({
    url: chrome.runtime.getURL('blank.html'),
    type: 'popup',
    width: 1000,
    height: 700
  });
}); 