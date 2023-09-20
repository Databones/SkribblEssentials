// ==UserScript==
// @name         Skribbl Essentials 1.0
// @version      1.0
// @namespace    http://tampermonkey.net
// @description  Provides a list of potential words for skribbl.io
// @author       Databones
// @match        *://skribbl.io/*
// @icon         https://raw.githubusercontent.com/Databones/SkribblEssentials/main/SkribblEssentials.png
// ==/UserScript==

// --- ::CHANGELOG:: 9/20/2023 ---
// + Creation of Skribbl Essentials
// + Added suggestions

!function(){"use strict";localStorage.removeItem("wordList");const e=document.querySelector("form"),t=document.querySelector('form input[placeholder="Type your guess here..."]'),o=document.querySelector(".chat-content");if(e){const n=document.createElement("div");n.className="suggestions",n.style.maxHeight="150px",n.style.overflowY="auto",e.appendChild(n);const r=new Set;function s(){const e=t.value.toLowerCase(),s=document.querySelectorAll(".hints .container .hint"),c=Array.from(s).map((e=>e.classList.contains("uncover")?e.textContent:e.textContent.replace(/_/g,"[^\\s-]"))).join(""),a=localStorage.getItem("wordList");if(a){let s=a.split("\n").filter((e=>new RegExp(`^${c}$`,"i").test(e)));if(o){o.querySelectorAll('p[style*="var(--COLOR_CHAT_TEXT_BASE)"] span').forEach((e=>{const t=e.textContent.trim();if(t&&s.includes(t)){const e=s.indexOf(t);s.splice(e,1)}}))}s=s.filter((e=>!r.has(e.toLowerCase()))),n.innerHTML="";s.filter((t=>t.toLowerCase().includes(e))).forEach((e=>{const o=document.createElement("button");o.textContent=e,o.style.color="black",o.style.margin="5px",o.style.borderRadius="5px",o.addEventListener("click",(()=>{if(t){const o=e.toLowerCase();t.value=o,r.add(o);const n=new KeyboardEvent("keydown",{key:"Enter",keyCode:13,bubbles:!0,cancelable:!0});t.dispatchEvent(n)}})),n.appendChild(o)}))}}t.addEventListener("input",s);const c={subtree:!0,childList:!0};new MutationObserver(s).observe(document.querySelector(".hints .container"),c);new MutationObserver(s).observe(o,{childList:!0,subtree:!0}),s()}localStorage.getItem("wordList")?console.log("Data already exists in localStorage."):fetch("https://raw.githubusercontent.com/Databones/SkribblEssentials/main/wordList").then((e=>e.text())).then((e=>{localStorage.setItem("wordList",e),console.log("Data fetched and stored in localStorage.")})).catch((e=>{console.error("Error fetching data:",e)}))}();
