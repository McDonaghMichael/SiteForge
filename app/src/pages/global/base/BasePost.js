import DocumentMeta, {render} from 'react-document-meta';
import {useEffect, useLayoutEffect, useState} from "react";
import axios from "axios";
import {getPages, getPosts, getTime} from "../../../widgets/PageWidgets";

export default function BasePost ({theme, post, settings}) {

    const [postHTML, setPostHTML] = useState([]);

    const meta = {
        title: settings.site_title + " | " + post.title,
        description: post.meta_description,
        meta: {
            charset: 'utf-8',
            name: {
                keywords: post.meta_keywords
            }
        }
    };
    

    useEffect(() => {

        if (!theme || !theme.standard_page) {
            return;
        }

        let h = post.html
            .replace("[TIME]", getTime());

        switch (post.type) {
            case 1:
                setPostHTML(theme.standard_page.replace("[HTML]", h));
                break;
            default:
                setPostHTML(h);
                break;
        }

    }, [post.html, theme.standard_page, post.type, theme]);



    return (
        <>
            <DocumentMeta {...meta}>
                <style dangerouslySetInnerHTML={{__html: theme.css}}>
                </style>

                <style dangerouslySetInnerHTML={{__html: post.css}}>
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

                <div dangerouslySetInnerHTML={{__html: postHTML}}>
                </div>

                <div dangerouslySetInnerHTML={{__html: theme.footer}}>
                </div>
            </DocumentMeta>
        </>
    )};
