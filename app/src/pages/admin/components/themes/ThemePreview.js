export default function ThemePreview({ css, html }) {
    return (
        <div className="theme-container">
            <style dangerouslySetInnerHTML={{ __html: `.theme-container { ${css} }` }} />
            <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
    );
}
