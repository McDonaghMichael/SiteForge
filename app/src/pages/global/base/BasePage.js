import DocumentMeta, {render} from 'react-document-meta';
import {useEffect, useState} from "react";
import {getPages, getTime} from '../../../widgets/pages/PageWidgets'

export default function BasePage ({theme, page, settings}) {

        const meta = {
            title: "test" + " | " + page.title,
            description: page.meta_description,
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

                <style dangerouslySetInnerHTML={{__html: theme.css}}>
                </style>

                <style dangerouslySetInnerHTML={{__html: page.css}}>
                </style>

                <div dangerouslySetInnerHTML={{__html: theme.navbar}}>
                </div>

                <div dangerouslySetInnerHTML={{__html: page.html}}>
                </div>

                <div dangerouslySetInnerHTML={{__html: theme.footer}}>
                </div>
            </DocumentMeta>
        </>
    )
}