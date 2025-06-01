import { initChatbotEvents } from '../assets/chatbot.js';

async function loadComponent(id, path, callback) {
    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`Failed to fetch ${path}`);
        const html = await res.text();
        const container = document.getElementById(id);
        container.innerHTML = html;

        if (typeof callback === 'function') {
            callback(); // ✅ sidebar.html 로드 후 이벤트 바인딩 및 active 처리
        }
    } catch (err) {
        console.error('[loadComponent error]', err);
    }
}

function bindSidebarToggleEvents() {
    // 1. 메뉴 펼치기
    document.querySelectorAll('.sidebar-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const li = toggle.closest('li');
            li.classList.toggle('active');
        });
    });

    // 2. 현재 경로 기준 active 처리
    const currentFile = location.pathname.split('/').filter(Boolean).pop();

    document.querySelectorAll('.sidebar a').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        if (href.includes(currentFile)) {
            link.classList.add('active');

            // ✅ 여기: 가장 가까운 submenu ul의 바로 상위 li를 강제로 찾는다
            const submenu = link.closest('ul');
            if (submenu && submenu.classList.contains('submenu')) {
                const topLevelLi = submenu.parentElement;
                if (topLevelLi?.tagName === 'LI') {
                    topLevelLi.classList.add('active');
                    const topLevelLink = topLevelLi.querySelector('a.sidebar-toggle');
                    if (topLevelLink) {
                        topLevelLink.classList.add('active');
                    }
                }
            }
        }
    });
}


window.addEventListener('DOMContentLoaded', () => {
    loadComponent('sidebar-container', '../../components/sidebar.html', bindSidebarToggleEvents);
    loadComponent('chatbot-container', '../../components/chatbot.html', () => {
        if (typeof initChatbotEvents === 'function') {
            initChatbotEvents();
        }
    });
});
