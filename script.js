// ==UserScript==
// @name         Pomodoro Social Flow (Manual Mode)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  สะสมเวลาโฟกัส + ปุ่มสลับโหมดคุยงาน
// @author       You (with Bro's spirit)
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // 1. Setup UI (ปุ่มควบคุมมุมขวาบน)
    GM_addStyle(`
        #bro-control-panel { position: fixed; top: 10px; right: 10px; z-index: 1000000; background: #222; color: #fff; padding: 10px; border-radius: 8px; font-family: sans-serif; font-size: 12px; border: 1px solid #444; }
        #bro-toggle-btn { cursor: pointer; padding: 5px 10px; border: none; border-radius: 4px; font-weight: bold; }
        .mode-focus { background: #2ecc71; color: white; }
        .mode-work-social { background: #e67e22; color: white; }
    `);

    const panel = document.createElement('div');
    panel.id = 'bro-control-panel';
    document.body.appendChild(panel);

    const overlay = document.createElement('div');
    overlay.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:999999; display:none; flex-direction:column; justify-content:center; align-items:center; color:white; font-family:sans-serif; pointer-events:all;";
    overlay.innerHTML = `<h1>OUT OF CREDIT!</h1><p>Bro, you're out of social time. Go back to work!</p>`;
    document.body.appendChild(overlay);

    // 2. Logic & State
    const socialSites = ['facebook.com', 'tiktok.com', 'instagram.com', 'youtube.com'];
    const isSocialPage = socialSites.some(site => window.location.hostname.includes(site));

    function updateUI() {
        const isWorkingOnSocial = GM_getValue("isWorkingOnSocial", false);
        const credit = Math.floor(GM_getValue("socialCredit", 0));

        panel.innerHTML = `
            <div>Credit: <b>${credit}s</b></div>
            <button id="bro-toggle-btn" class="${isWorkingOnSocial ? 'mode-work-social' : 'mode-focus'}">
                ${isWorkingOnSocial ? '💼 Working Mode (Social)' : '🎯 Focus Mode'}
            </button>
        `;

        document.getElementById('bro-toggle-btn').onclick = () => {
            GM_setValue("isWorkingOnSocial", !isWorkingOnSocial);
            updateUI();
        };

        // การแสดงผล Overlay
        if (isSocialPage && !isWorkingOnSocial && credit <= 0) {
            overlay.style.display = "flex";
        } else {
            overlay.style.display = "none";
        }
    }

    // 3. Main Loop
    setInterval(() => {
        let credit = GM_getValue("socialCredit", 0);
        const isWorkingOnSocial = GM_getValue("isWorkingOnSocial", false);

        if (isSocialPage) {
            if (isWorkingOnSocial) {
                // โหมดคุยงานบนโซเชียล: ไม่เพิ่มและไม่ลดแต้ม
            } else if (credit > 0) {
                credit--; // เล่นปกติ: ลดแต้ม
            }
        } else {
            // อยู่หน้าเว็บอื่น (ทำงาน): สะสมแต้ม
            credit += 0.2;
        }

        GM_setValue("socialCredit", credit);
        updateUI();
    }, 1000);

    updateUI(); // รันครั้งแรก
})();