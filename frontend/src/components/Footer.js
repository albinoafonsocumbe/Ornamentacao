import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Share2, Heart, MessageCircle } from 'lucide-react';
import './Footer.css';

function Footer() {
    const ano = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-top">

                {/* Brand */}
                <div className="footer-brand">
                    <h3>
                        <span aria-hidden="true">✦</span>
                        Ornamentação
                    </h3>
                    <p>
                        Transformamos os seus momentos especiais em memórias
                        inesquecíveis — com elegância, criatividade e dedicação
                        em cada detalhe.
                    </p>
                    <div className="footer-social">
                        <a href="#!" aria-label="Instagram" title="Instagram">
                            <Heart size={18} strokeWidth={1.5} />
                        </a>
                        <a href="#!" aria-label="Facebook" title="Facebook">
                            <Share2 size={18} strokeWidth={1.5} />
                        </a>
                        <a href="#!" aria-label="WhatsApp" title="WhatsApp">
                            <MessageCircle size={18} strokeWidth={1.5} />
                        </a>
                    </div>
                </div>

                {/* Navegação */}
                <div className="footer-col">
                    <h4>Navegação</h4>
                    <ul>
                        <li><Link to="/">Início</Link></li>
                        <li><Link to="/sobre">Sobre Nós</Link></li>
                        <li><Link to="/servicos">Serviços</Link></li>
                        <li><Link to="/eventos">Eventos</Link></li>
                        <li><Link to="/portefolio">Portefólio</Link></li>
                        <li><Link to="/calculadora">Calculadora</Link></li>
                    </ul>
                </div>

                {/* Serviços */}
                <div className="footer-col">
                    <h4>Especialidades</h4>
                    <ul>
                        <li><Link to="/servicos">Casamentos</Link></li>
                        <li><Link to="/servicos">Batizados</Link></li>
                        <li><Link to="/servicos">Aniversários</Link></li>
                        <li><Link to="/servicos">Formaturas</Link></li>
                        <li><Link to="/pacotes">Pacotes</Link></li>
                        <li><Link to="/contacto">Orçamentos</Link></li>
                    </ul>
                </div>

                {/* Contacto */}
                <div className="footer-col">
                    <h4>Contacto</h4>
                    <ul className="contacto-list">
                        <li>
                            <Phone size={14} strokeWidth={1.5} />
                            +258 84 000 0000
                        </li>
                        <li>
                            <Mail size={14} strokeWidth={1.5} />
                            geral@ornamentacao.co.mz
                        </li>
                        <li>
                            <MapPin size={14} strokeWidth={1.5} />
                            Maputo, Moçambique
                        </li>
                        <li>
                            <Clock size={14} strokeWidth={1.5} />
                            Segunda–Sábado: 8h–18h
                        </li>
                    </ul>
                </div>

            </div>

            <div className="footer-bottom">
                <p>&copy; {ano} <strong>Ornamentação</strong>. Todos os direitos reservados.</p>
                <Link to="/contacto" className="footer-cta">
                    Pedir Orçamento Gratuito →
                </Link>
            </div>
        </footer>
    );
}

export default Footer;
