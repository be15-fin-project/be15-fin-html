import { initChatbot  } from '../assets/chatbot.js';

async function loadComponent(id, path, callback) {
    try {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`Failed to fetch ${path}`);
        const html = await res.text();
        const container = document.getElementById(id);
        if (!container) throw new Error(`No container found for #${id}`);
        container.innerHTML = html;

        if (typeof callback === 'function') {
            callback(); // 로드 후 이벤트 바인딩
        }
    } catch (err) {
        console.error(`[loadComponent error] #${id}:`, err);
    }
}

function bindSidebarToggleEvents() {
    // 1. 접힘/펼침 토글
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    toggleBtn?.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        // main-content padding-left 조정
        if (sidebar.classList.contains('collapsed')) {
            mainContent.style.paddingLeft = '8rem'; // 예시 값
        } else {
            mainContent.style.paddingLeft = '25rem'; // 기본값
        }

        // 접힘 시 모든 하위 메뉴 닫고 active 제거
        if (sidebar.classList.contains('collapsed')) {
            document.querySelectorAll('.sidebar-indent').forEach(el => el.classList.remove('open'));
            document.querySelectorAll('.sidebar-item.active').forEach(el => el.classList.remove('active'));
        }
    });

    // 2. 아코디언 방식 메뉴 열기/닫기
    document.querySelectorAll('.sidebar-item').forEach(link => {
        const indent = link.nextElementSibling;
        if (indent && indent.classList.contains('sidebar-indent')) {
            link.addEventListener('click', e => {
                e.preventDefault();

                const isOpen = indent.classList.contains('open');

                // 전체 닫기
                document.querySelectorAll('.sidebar-indent').forEach(el => el.classList.remove('open'));
                document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));

                if (!isOpen) {
                    indent.classList.add('open');
                    link.classList.add('active');
                }
            });
        }
    });

    // 3. 현재 경로에 맞는 메뉴 자동 열기
    const currentFile = location.pathname.split('/').filter(Boolean).pop();
    document.querySelectorAll('.sidebar a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(currentFile)) {
            link.classList.add('active');

            const indent = link.closest('.sidebar-indent');
            if (indent) {
                indent.classList.add('open');
                const parent = indent.previousElementSibling;
                if (parent?.classList.contains('sidebar-item')) {
                    parent.classList.add('active');
                }
            }
        }
    });
}

window.addEventListener('DOMContentLoaded', () => {
    loadComponent('sidebar-container', '../../components/sidebar.html', bindSidebarToggleEvents);
    loadComponent('chatbot-container', '../../components/chatbot.html', () => {
        if (typeof initChatbot  === 'function') {
            initChatbot();
        }
    });
});
