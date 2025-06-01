export function initChatbotEvents() {
    const toggleButton = document.getElementById('chatToggle');
    const chatPopup = document.getElementById('chatPopup');
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatBody = document.getElementById('chatBody');

    // 토글 버튼 클릭 시 팝업 열고 닫기
    toggleButton?.addEventListener('click', () => {
        const isOpen = chatPopup?.style.display === 'flex';
        chatPopup.style.display = isOpen ? 'none' : 'flex';
    });

    // 메시지 전송 처리 함수
    function sendMessage() {
        const text = chatInput.value.trim();
        if (text !== '') {
            const msg = document.createElement('div');
            msg.textContent = '🙋 ' + text;
            msg.style.marginTop = '8px';
            chatBody.appendChild(msg);
            chatInput.value = '';
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }

    // 전송 버튼 클릭 시 전송
    chatSendBtn?.addEventListener('click', sendMessage);

    // 엔터 키로 전송
    chatInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}
