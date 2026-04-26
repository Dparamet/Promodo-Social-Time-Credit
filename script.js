// ==UserScript==
// @name         Super Pomodoro v2.1 (Fixed Dropdown & Logic)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Hybrid Pomodoro + Fixed Dropdown UI
// @author       You (with Bro's spirit)
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #bro-panel { position: fixed; top: 50px; right: 20px; z-index: 1000000; background: #1a1a1a; color: #fff; padding: 15px; border-radius: 12px; font-family: sans-serif; width: 220px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); cursor: move; user-select: none; border: 1px solid #333; }
        .btn-group { display: flex; gap: 5px; margin-top: 10px; }
        button { cursor: pointer; border: none; border-radius: 4px; padding: 8px; flex: 1; font-weight: bold; font-size: 11px; text-transform: uppercase; }
        .btn-play { background: #2ecc71; color: white; }
        .btn-stop { background: #e67e22; color: white; }
        #display-time { font-size: 24px; text-align: center; margin: 10px 0; color: #00d2ff; font-weight: bold; }
        .overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.98); z-index:999999; display:none; flex-direction:column; justify-content:center; align-items:center; color:white; pointer-events:all; }
    `);

    // --- 1. Initial UI Structure (Render ครั้งเดียว) ---
    const panel = document.createElement('div');
    panel.id = 'bro-panel';
    panel.innerHTML = `
        <div id="status-tag" style="font-size:10px; color:#aaa; text-align:center;">STOPPED</div>
        <div id="display-time">0m 0s</div>
        <div style="font-size:12px; color:#a9a9a9; text-align:center; margin-bottom:6px;">
            MVP: Start / Stop only
        </div>
        <div class="btn-group">
            <button class="btn-play" id="btn-play">PLAY</button>
            <button class="btn-stop" id="btn-stop">STOP</button>
        </div>
    `;
    document.body.appendChild(panel);

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `<h1 style="font-size:48px;">⚠️ OUT OF TIME</h1><p>Bro, the fun is over. Back to work!</p>`;
    document.body.appendChild(overlay);

    // --- 2. Draggable Logic ---
    let isDragging = false, offset = [0,0];
    panel.onmousedown = (e) => {
        if (['BUTTON', 'SELECT', 'OPTION'].includes(e.target.tagName)) return;
        isDragging = true;
        offset = [panel.offsetLeft - e.clientX, panel.offsetTop - e.clientY];
    };
    document.onmousemove = (e) => {
        if (!isDragging) return;
        panel.style.left = (e.clientX + offset[0]) + 'px';
        panel.style.top = (e.clientY + offset[1]) + 'px';
    };
    document.onmouseup = () => isDragging = false;

    // --- 3. Functional Logic ---
    const socialSites = ['facebook.com', 'tiktok.com', 'instagram.com', 'youtube.com', 'x.com'];
    const isSocialPage = socialSites.some(site => window.location.hostname.includes(site));

    const clampSeconds = (value) => Math.max(0, Math.floor(Number(value) || 0));

    const formatSeconds = (value) => {
        const safeSeconds = clampSeconds(value);
        const minutes = Math.floor(safeSeconds / 60);
        const seconds = safeSeconds % 60;
        return `${minutes}m ${seconds}s`;
    };

    const syncUI = () => {
        const status = GM_getValue("pomoStatus", "stop");
        const credit = clampSeconds(GM_getValue("socialCredit", 0));
        const elapsed = clampSeconds(GM_getValue("elapsedSeconds", 0));
        
        // Update เฉพาะ Text ไม่ Re-render ทั้งก้อน (แก้ปัญหา Dropdown หลุด)
        document.getElementById('display-time').innerText = formatSeconds(elapsed);
        document.getElementById('status-tag').innerText = status.toUpperCase();

        // Overlay Logic
        if (isSocialPage && status === "play" && credit <= 0) {
            overlay.style.display = "flex";
        } else {
            overlay.style.display = "none";
        }
    };

    // Events
    document.getElementById('btn-play').onclick = () => {
        GM_setValue("elapsedSeconds", 0);
        GM_setValue("pomoStatus", "play");
        syncUI();
    };
    document.getElementById('btn-stop').onclick = () => GM_setValue("pomoStatus", "stop");

    // --- 4. Main Loop ---
    setInterval(() => {
        const status = GM_getValue("pomoStatus", "stop");

        if (status === "play") {
            const elapsed = clampSeconds(GM_getValue("elapsedSeconds", 0));
            GM_setValue("elapsedSeconds", elapsed + 1);

            let credit = Number(GM_getValue("socialCredit", 0)) || 0;
            if (isSocialPage) {
                credit = Math.max(0, credit - 1);
            } else {
                credit += 0.2;
            }
            GM_setValue("socialCredit", credit);
        }
        syncUI();
    }, 1000);

    syncUI();
})();