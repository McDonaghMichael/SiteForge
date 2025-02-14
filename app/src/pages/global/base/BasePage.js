import DocumentMeta, {render} from 'react-document-meta';
import {useEffect, useState} from "react";

export default function BasePage ({theme, page}) {

        const [pageHtml, setPageHtml] = useState('');

        const meta = {
            title: page.meta_title,
            description: page.meta_description,
            meta: {
                charset: 'utf-8',
                name: {
                    keywords: page.meta_keywords
                }
            }
        };

    useEffect(() => {
        if (page.bootstrap === 1) {
            const link = document.createElement("link");
            link.href = "https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css";
            link.rel = "stylesheet";
            document.head.appendChild(link);
        }
    }, [page.bootstrap]);

    useEffect(() => {
        let x;
        switch (page.type) {
            case 0:
                x = page.html;
                break;
            case 1:
                x = theme.standard_page;
                break;

        }
        x = x.replace("[HTML]", page.html);
        x = x.replace("[TIME]", Date.now().toString());
        x = x.replace("[PAGE_TITLE]", page.title);
        x = x.replace("[PAGE_META_DESCRIPTION]", page.meta_description);

        setPageHtml(x);
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