import DocumentMeta from 'react-document-meta';

export default function NotFoundPage ({theme, settings}) {

    const meta = {
        title: "Page not found",
        description: "The following page has not been found.",
    };
    return (
      <>
        <DocumentMeta {...meta}>
          <style dangerouslySetInnerHTML={{ __html: theme.css }}></style>
            {theme.navbar && settings.navbar_items && (
                <div
                    dangerouslySetInnerHTML={{
                        __html: theme.navbar.replace(
                            "[ITEMS]",
                            settings.navbar_items
                                .map(
                                    (item) =>
                                        `<li class="nav-item"><a class="nav-link active" href=${item.slug}>${item.title}</a></li>`,
                                )
                                .join(""),
                        ),
                    }}
                ></div>
            )}

            <div dangerouslySetInnerHTML={{__html: theme.not_found_page}}></div>

            <div dangerouslySetInnerHTML={{__html: theme.footer}}></div>
        </DocumentMeta>
      </>
    );

}