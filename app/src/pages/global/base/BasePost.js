import DocumentMeta, {render} from 'react-document-meta';
import {useEffect, useLayoutEffect, useState} from "react";
import axios from "axios";

export default function BasePost ({theme, page, settings}) {

    const [navbarItems, setNavbarItems] = useState([]);
    const [navbarLoaded, setNavbarLoaded] = useState(false);

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

        const fetchData = async () => {
            try {
                const items = settings.navbar_items.map(item => ({ id: item, data: null }));

                const requests = items.map(item =>
                    axios.get(`http://localhost:8080/page/id/${item.id}`)
                        .then(res => ({ ...item, data: res.data }))
                        .catch(error => {
                            console.error("Error fetching page data:", error);
                            return { ...item, data: { title: "Error" } };
                        })
                );

                const results = await Promise.all(requests);
                setNavbarItems(results);
                setNavbarLoaded(true);
            } catch (error) {
                console.error("Error loading navbar items:", error);
            }
        };

        fetchData();
    }, [settings.navbar_items]);

    return (
        <>
            <DocumentMeta {...meta}>
                <style dangerouslySetInnerHTML={{__html: theme.css}}>
                </style>

                <style dangerouslySetInnerHTML={{__html: page.css}}>
                </style>

                {navbarLoaded && (
                    <div dangerouslySetInnerHTML={{
                        __html:
                            theme.navbar.replace("[ITEMS]",
                                navbarItems.map(item => `<li class="nav-item"><a class="nav-link active" href=${item.data.slug}>${item.data.title}</a></li>`).join("")
                            )
                    }}>
                    </div>
                )}


                <div dangerouslySetInnerHTML={{__html: page.html}}>
                </div>

                <div dangerouslySetInnerHTML={{__html: theme.footer}}>
                </div>
            </DocumentMeta>
        </>
    )
}