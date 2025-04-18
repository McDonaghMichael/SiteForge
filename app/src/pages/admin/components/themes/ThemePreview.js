export default function ThemePreview({ css, html }) {
    return (
      <div className="theme-container">
        {css && (
          <style
            dangerouslySetInnerHTML={{
              __html: `.theme-container { ${css.replace("fixed", "static")} }`,
            }}
          />
        )}

        {html && (
          <div
            dangerouslySetInnerHTML={{
              __html: html
                .replace("[ITEMS]", "Homepage")
                .replace("[SITE_TITLE]", "SiteForge"),
            }}
          ></div>
        )}
      </div>
    );
}
