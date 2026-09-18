/**
 * LazyImg — wrapper de <img> com lazy loading nativo
 * + fallback de cor enquanto carrega
 * + tratamento de erro com placeholder
 */
function LazyImg({ src, alt, className, style, ...props }) {
    return (
        <img
            src={src}
            alt={alt || ''}
            className={className}
            style={style}
            loading="lazy"
            decoding="async"
            onError={(e) => {
                // Substituir por placeholder neutro se a imagem falhar
                e.currentTarget.style.background = '#f0e4d4';
                e.currentTarget.style.opacity = '0.5';
                e.currentTarget.removeAttribute('src');
            }}
            {...props}
        />
    );
}

export default LazyImg;
