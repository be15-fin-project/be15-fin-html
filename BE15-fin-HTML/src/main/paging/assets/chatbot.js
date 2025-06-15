export function initChatbot() {
    new ChatBot();
}

class ChatBot {
    constructor() {
        this.isOpen = false;
        this.faqData = {
            '가격 문의': '상품별로 가격이 다릅니다. 구체적인 상품명을 알려주시면 정확한 가격을 안내해드리겠습니다.',
            '결제 방법': '신용카드, 체크카드, 계좌이체, 휴대폰 결제, 카카오페이, 네이버페이 등 다양한 결제 방법을 지원합니다.',
            '배송 정보': '평일 오후 2시 이전 주문 시 당일 발송됩니다. 배송은 보통 1-2일 소요되며, 무료배송 기준은 3만원 이상입니다.',
            '환불 정책': '상품 수령 후 7일 이내 환불 신청이 가능합니다. 단순 변심의 경우 반품비가 발생할 수 있습니다.',
            '고객센터': '고객센터는 평일 09:00-18:00 운영됩니다. 전화: 1588-1234 또는 이메일: support@company.com으로 문의해주세요.'
        };
        this.setupElements();
        this.bindEvents();
    }

    setupElements() {
        this.chatButton = document.getElementById('chatButton');
        this.closeButton = document.getElementById('closeChat');
        this.sendButton = document.getElementById('sendMessage');
        this.messageInput = document.getElementById('messageInput');
        this.chatModal = document.getElementById('chatModal');
        this.chatMessages = document.getElementById('chatMessages');
        this.faqButtons = document.querySelectorAll('.faq-btn');
    }

    bindEvents() {
        this.chatButton?.addEventListener('click', () => this.toggleChat());
        this.closeButton?.addEventListener('click', () => this.closeChat());
        this.sendButton?.addEventListener('click', () => this.sendUserMessage());
        this.messageInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendUserMessage();
        });

        this.faqButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.faqButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.handleFAQ(btn.textContent, btn.dataset.question);
            });
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.chatModal.style.display = this.isOpen ? 'block' : 'none';
        document.body.style.overflow = this.isOpen ? 'hidden' : 'auto';
    }

    closeChat() {
        this.isOpen = false;
        this.chatModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    handleFAQ(displayText, question) {
        this.addUserMessage(displayText);
        setTimeout(() => {
            this.addBotMessage(this.faqData[question] || '답변을 준비 중입니다.');
        }, 800);
    }

    sendUserMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        this.addUserMessage(message);
        this.messageInput.value = '';
        this.handleUserQuery(message);
    }

    handleUserQuery(message) {
        const lower = message.toLowerCase();
        let reply = '죄송합니다. 좀 더 구체적으로 입력해 주세요.';

        if (lower.includes('가격') || lower.includes('비용')) reply = this.faqData['가격 문의'];
        else if (lower.includes('결제')) reply = this.faqData['결제 방법'];
        else if (lower.includes('배송')) reply = this.faqData['배송 정보'];
        else if (lower.includes('환불') || lower.includes('반품')) reply = this.faqData['환불 정책'];
        else if (lower.includes('고객센터') || lower.includes('전화')) reply = this.faqData['고객센터'];
        else if (lower.includes('안녕') || lower.includes('hello')) reply = '안녕하세요! 무엇을 도와드릴까요?';
        else if (lower.includes('감사') || lower.includes('고마워')) reply = '감사합니다. 더 궁금한 점이 있으신가요?';

        this.showTypingIndicator();
        setTimeout(() => {
            this.hideTypingIndicator();
            this.addBotMessage(reply);
        }, 1000);
    }

    addUserMessage(message) {
        const msg = document.createElement('div');
        msg.className = 'message user';
        msg.innerHTML = `
            <div class="chat-bubble-user">${message}</div>
            <div class="chat-avatar"><i class="fas fa-user" style="color: white;"></i></div>
        `;
        this.chatMessages.appendChild(msg);
        this.scrollToBottom();
    }

    addBotMessage(message) {
        const msg = document.createElement('div');
        msg.className = 'message';
        msg.innerHTML = `
            <div class="chat-avatar">
                <img src="../../assets/images/logo.png" alt="Momentum Logo" style="height: 22px;" />
            </div>
            <div class="chat-bubble-bot">${message}</div>
        `;
        this.chatMessages.appendChild(msg);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const typing = document.createElement('div');
        typing.id = 'typingIndicator';
        typing.className = 'message';
        typing.innerHTML = `
            <div class="chat-avatar">
                <img src="../../assets/images/logo.png" alt="Momentum Logo" style="height: 22px;" />
            </div>
            <div>
                <div class="typing-indicator"></div>
                <div class="typing-indicator"></div>
                <div class="typing-indicator"></div>
            </div>
        `;
        this.chatMessages.appendChild(typing);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}
