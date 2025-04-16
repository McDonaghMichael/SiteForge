import DocumentMeta from 'react-document-meta';
import {useEffect, useState} from "react";
import { getTime } from "../../../widgets/PageWidgets";

export default function BasePage ({theme, page, settings}) {

    const [pageHTML, setPageHTML] = useState([]);

    const meta = {
            title: settings.site_title + " | " + page.title,
            description: page.meta_description,
            meta: {
                charset: 'utf-8',
                name: {
                    keywords: page.meta_keywords
                }
            }
        };

    useEffect(() => {

        if (!theme || !theme.standard_page) {
            return;
        }

        let h = page.html
            .replace("[TIME]", getTime())
            .replace("[POSTS]", "Posts");

        switch (page.type) {
            case 1:
                setPageHTML(theme.standard_page.replace("[HTML]", h));
                break;
            default:
                setPageHTML(h);
                break;
        }

    }, [page.html, theme.standard_page, page.type, theme]);



    return (
        <>
            <DocumentMeta {...meta}>
                <style dangerouslySetInnerHTML={{__html: theme.css}}>
                </style>

                <style dangerouslySetInnerHTML={{__html: page.css}}>
                </style>

                {theme.navbar && settings.navbar_items && (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: theme.navbar
                                .replace(
                                    "[ITEMS]",
                                    settings.navbar_items
                                        .map(
                                            (item) =>
                                                `<li class="nav-item"><a class="nav-link active" href=${item.slug}>${item.title}</a></li>`
                                        )
                                        .join("")
                                )
                                .replace("[SITE_TITLE]", settings.site_title),
                        }}
                    ></div>
                )}

                <div dangerouslySetInnerHTML={{__html: pageHTML}}>
                </div>

                <div dangerouslySetInnerHTML={{__html: theme.footer}}>
                </div>
            </DocumentMeta>
        </>
    )
}