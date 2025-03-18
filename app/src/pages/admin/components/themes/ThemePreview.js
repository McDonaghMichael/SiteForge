export default function ThemePreview({ css, html }) {
    return (
        <div className="theme-container">
            <style dangerouslySetInnerHTML={{ __html: `.theme-container { ${css} }` }} />

            {html && (
                <div dangerouslySetInnerHTML={{__html: html.replace("[ITEMS]", "Homepage")}}/>
            )}


        </div>
    );
}
