# Pingfence Chrome Extension

![Pingfence Logo](img0001-modified-modified.png)

## Overview
**Pingfence** is a next-generation Chrome extension designed to provide robust online protection, privacy, and productivity for users of all backgrounds. It combines advanced threat detection, customizable security profiles, and real-time analytics to keep you safe from malicious, distracting, or unwanted web content.

## What is Pingfence?
Pingfence is a browser security and productivity extension that filters, blocks, and monitors web traffic to protect users from threats such as malware, phishing, cryptojacking, and unwanted ads. It also offers parental controls, distraction-free modes, and a powerful dashboard for monitoring all network requests.

## Why was it made?
Pingfence was created to address the growing need for:
- **Comprehensive online security** against modern threats (malware, phishing, cryptojacking, etc.)
- **User privacy** and data protection
- **Productivity and parental control** by blocking distracting or harmful sites
- **Transparency** in web activity through a real-time dashboard

## What does it represent?
Pingfence stands for:
- **User empowerment**: You control your browsing experience
- **Security-first design**: Proactive protection, not just passive filtering
- **Privacy**: No user data leaves your device; all analytics are local
- **Customizability**: Multiple profiles for different needs (Professional, Home, Parental, Focused, Hardened, Casual)

## Key Features
- **Blacklist filtering**: Blocks access to known bad URLs and domains
- **Alerting system**: Notifies users of potentially dangerous or suspicious sites
- **Authentic source navigation**: Guides users to official sources for popular software
- **Local server protection**: Blocks connections to suspicious local servers (e.g., reverse shells)
- **HTTP blocking**: Prevents access to insecure HTTP sites
- **Dark web protection**: Blocks .onion and deep web domains
- **Whitelist/Blacklist management**: Allows trusted sites while blocking harmful ones
- **GUI dashboard**: Visualizes all network requests in real time
- **Data storage**: Saves request details (URL, type, request ID, method, etc.) locally
- **Privacy-preserving analytics**: Machine learning model accumulates behavioral data locally; only anonymized weights/behaviors are used
- **Ad blocking**: Removes ads and ad domains
- **Phishing protection**: Blocks known phishing domains
- **Malware protection**: Blocks malware and suspicious domains
- **Cryptojacking protection**: Detects and blocks mining scripts
- **Profile-based filtering**: Choose from Professional, Home, Parental, Focused, Hardened, or Casual profiles
- **Parental controls**: Restricts adult, gambling, and violent content
- **Distraction-free mode**: Blocks social media, streaming, and entertainment sites
- **Personal data protection**: Prevents tracking and data leaks

## Technology Stack
- **Manifest V3** Chrome Extension
- **JavaScript (ES6+)** for all logic and UI
- **jQuery** for dashboard interactivity
- **HTML/CSS** for popup and dashboard UI
- **Chrome APIs**: webRequest, storage, notifications, tabs, scripting
- **No external server required**: All processing is local

## Setup & Installation
1. **Clone or Download** this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the project folder.
5. Pingfence will appear in your extensions bar.

## Usage
- Click the Pingfence icon to open the popup menu.
- Choose your desired **Profile** (Professional, Home, Casual, Parental, Focused, Hardened).
- Toggle features like **Ad Blocking**, **Phishing Protection**, **Malware Protection**, and **Cryptojacking Protection**.
- Click **Open Parsed URLs Dashboard** to view all network requests, filter them, and inspect details.
- Analytics for blocked threats, ads, and malicious sites are shown in the popup.

### Profiles Explained
- **Professional**: Blocks social media, streaming, entertainment, and editing sites. Allows productivity/work sites.
- **Home**: Blocks adult, gambling, and high-risk sites. Allows general browsing and streaming.
- **Casual**: Minimal blocking; only blocks known malicious/phishing/adult sites.
- **Parental Control**: Blocks adult, gambling, violence, social media, streaming, and shopping. Allows educational/kid-friendly sites.
- **Focused**: Distraction-free browsing. Blocks social media, streaming, gaming, shopping, and entertainment. Removes ads and notifications.
- **Hardened Security**: Maximum protection. Blocks malware, cryptojacking, deep web, phishing, tracking, and suspicious elements. Includes personal data protection.

## Dashboard
- Accessed via the popup (**Open Parsed URLs Dashboard**)
- View, filter, and inspect all network requests
- See request details: URL, type, request ID, method, headers, etc.
- Data is stored locally and never leaves your device

## Privacy & Data
- **No user data is sent to any server**
- All analytics and machine learning are performed locally
- Only anonymized behavioral weights may be used for future improvements

## Support & Contact
- Instagram: [@pingfence](https://instagram.com/pingfence)
- Email: [pingfence@gmail.com](mailto:pingfence@gmail.com)
- Website: [pingfence.vercel.app](https://pingfence.vercel.app)

## License
&copy; Pingfence 2024. All rights reserved. 