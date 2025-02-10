import DocumentMeta, {render} from 'react-document-meta';

export default function BasePage ({theme, page}) {

        const meta = {
            title: page.meta_title,
            description: page.meta_description,
            canonical: 'http://example.com/path/to/page',
            meta: {
                charset: 'utf-8',
                name: {
                    keywords: page.meta_keywords
                }
            }
        };

    return (
        <>
            <DocumentMeta {...meta}>
            <style dangerouslySetInnerHTML={{ __html: theme.css }}>
            </style>
            <div dangerouslySetInnerHTML={{ __html: theme.navbar }}>
            </div>
                <div dangerouslySetInnerHTML={{ __html: page.html }}>
            </div>
            <div dangerouslySetInnerHTML={{ __html: theme.footer }}>
            </div>
            </DocumentMeta>
        </>
    )
}