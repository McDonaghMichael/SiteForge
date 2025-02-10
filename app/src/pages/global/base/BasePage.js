import DocumentMeta, {render} from 'react-document-meta';
import {useEffect, useState} from "react";

export default function BasePage ({theme, page}) {

        const [pageHtml, setPageHtml] = useState('');

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

    useEffect(() => {
        const updatedHtml = theme.standard_page.replace("[HTML]", page.html);
        setPageHtml(updatedHtml);
    }, [theme, page]);

    return (
        <>
            <DocumentMeta {...meta}>
                <style dangerouslySetInnerHTML={{__html: theme.css}}>
                </style>
                <style dangerouslySetInnerHTML={{__html: page.css}}>
                </style>
                <div dangerouslySetInnerHTML={{__html: theme.navbar}}>
                </div>


                <div dangerouslySetInnerHTML={{__html: pageHtml}}>
                </div>

                <div dangerouslySetInnerHTML={{__html: theme.footer}}>
                </div>
            </DocumentMeta>
        </>
    )
}