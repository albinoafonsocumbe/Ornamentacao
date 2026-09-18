import './Sobre.css';
import './Listagem.css';

function Sobre() {
    return (
        <div className="pagina">
            <div className="pagina-header">
                <div className="header-linha">A Nossa História</div>
                <h1>Sobre <span>Nós</span></h1>
                <p>Conheça a empresa que transforma momentos em memórias eternas</p>
            </div>

            <div className="sobre-layout">
                {/* Conteúdo principal */}
                <div className="sobre-texto">
                    <p className="sobre-intro">
                        "Cada evento é uma obra de arte única. O nosso papel é ser o pincel
                        que dá cor aos momentos mais importantes da sua vida."
                    </p>

                    <div className="sobre-bloco">
                        <h2>Quem Somos</h2>
                        <p>
                            Somos uma empresa especializada em decoração de eventos, com anos de experiência
                            a transformar espaços comuns em cenários extraordinários. Trabalhamos com
                            dedicação, criatividade e paixão para que cada evento seja verdadeiramente único
                            e inesquecível.
                        </p>
                    </div>

                    <div className="sobre-bloco">
                        <h2>A Nossa Missão</h2>
                        <p>
                            Criar experiências visuais marcantes que reflitam a personalidade e os sonhos
                            de cada cliente, garantindo qualidade premium, pontualidade absoluta e um
                            serviço completamente personalizado — do primeiro contacto ao desmonte
                            pós-evento.
                        </p>
                    </div>

                    <div className="sobre-bloco">
                        <h2>Os Nossos Valores</h2>
                        <ul className="valores-lista">
                            <li>Criatividade e inovação em cada projecto</li>
                            <li>Compromisso inabalável com a qualidade</li>
                            <li>Atendimento personalizado e próximo</li>
                            <li>Pontualidade e profissionalismo rigoroso</li>
                            <li>Uso de materiais premium e sustentáveis</li>
                            <li>Transparência total nos preços e processos</li>
                        </ul>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="sobre-sidebar">
                    <div className="sobre-stats-grid">
                        <div className="sobre-stat-card">
                            <div className="stat-num">200+</div>
                            <div className="stat-label">Eventos realizados</div>
                        </div>
                        <div className="sobre-stat-card">
                            <div className="stat-num">8+</div>
                            <div className="stat-label">Anos de experiência</div>
                        </div>
                        <div className="sobre-stat-card">
                            <div className="stat-num">5.0</div>
                            <div className="stat-label">Avaliação média</div>
                        </div>
                        <div className="sobre-stat-card">
                            <div className="stat-num">100%</div>
                            <div className="stat-label">Clientes satisfeitos</div>
                        </div>
                    </div>

                    <div className="sobre-destaque">
                        <h3>Baseados em Maputo</h3>
                        <p>
                            Prestamos serviços em todo o território de Moçambique,
                            com experiência em eventos de todos os tamanhos — de
                            reuniões íntimas a celebrações de 500 convidados.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default Sobre;
