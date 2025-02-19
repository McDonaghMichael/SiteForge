import DocumentMeta, {render} from 'react-document-meta';
import {useEffect, useState} from "react";
import axios from "axios";

export default function BasePage ({theme, page, settings}) {

    const [navbarItems, setNavbarItems] = useState([]);

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
        setNavbarItems(settings.navbar_items.map(item => (
            { id: item }
        )));

        console.log(navbarItems)
    }, [settings.navbar_items]);

    useEffect(() => {
        navbarItems.forEach(item => {
            axios.get("http://localhost:8080/page/id/" + item.id)
                .then(res => {
                    item.data = res.data;
                    console.log(item);
                })
                .catch(error => {
                    console.error("Error fetching theme:", error);
                });
        })
    }, [navbarItems])

    return (
        <>
            <DocumentMeta {...meta}>
                <style dangerouslySetInnerHTML={{__html: theme.css}}>
                </style>

                <style dangerouslySetInnerHTML={{__html: page.css}}>
                </style>

                <div dangerouslySetInnerHTML={{__html: theme.navbar.replace("[ITEMS]",
                        navbarItems.map(item => `<li class="nav-item"><a class="nav-link active" href=${item.id}>${item.id}</a></li>`).join("")
                    )}}>
                </div>


                <div dangerouslySetInnerHTML={{__html: page.html}}>
                </div>

                <div dangerouslySetInnerHTML={{__html: theme.footer}}>
                </div>
            </DocumentMeta>
        </>
    )
}