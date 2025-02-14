import DocumentMeta, {render} from 'react-document-meta';
import {useEffect, useState} from "react";

export default function NotFoundPage ({theme}) {

    const meta = {
        title: "Page not found",
        description: "The following page has not been found.",
    };
    return (
        <>
            <DocumentMeta {...meta}>
                <style dangerouslySetInnerHTML={{__html: theme.css}}>
                </style>
                <div dangerouslySetInnerHTML={{__html: theme.navbar}}>
                </div>


                <div dangerouslySetInnerHTML={{__html: theme.not_found_page}}>
                </div>

                <div dangerouslySetInnerHTML={{__html: theme.footer}}>
                </div>
            </DocumentMeta>
        </>
    )

}