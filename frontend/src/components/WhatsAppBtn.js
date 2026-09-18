import { MessageCircle } from 'lucide-react';
import './WhatsAppBtn.css';

const NUMERO = '258840000000'; // Alterar para o número real
const MENSAGEM = 'Olá! Gostaria de obter mais informações sobre os vossos serviços de decoração.';

function WhatsAppBtn() {
    const url = `https://wa.me/${NUMERO}?text=${encodeURIComponent(MENSAGEM)}`;

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn"
            aria-label="Falar connosco pelo WhatsApp"
            title="Falar pelo WhatsApp"
        >
            <span className="whatsapp-pulse"></span>
            <MessageCircle size={26} strokeWidth={2} />
            <span className="whatsapp-label">WhatsApp</span>
        </a>
    );
}

export default WhatsAppBtn;
