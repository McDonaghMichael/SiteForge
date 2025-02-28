import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {Link, Route} from "react-router-dom";
import BasePage from "../../global/base/BasePage";
import Button from "react-bootstrap/Button";
import Sidebar from "../components/sidebar/Sidebar";
import Container from "react-bootstrap/Container";
import {Row} from "react-bootstrap";
import {getSEOScore} from "../components/seo/SEOAnalyserData";
import ContentTableView from "../components/ContentTableView";

export default function ViewPPosts () {

    const [pages, setPages] = useState([]);

    const columns = useMemo(
        () => [
            {
                header: 'Title',
                accessorKey: 'title',
            },
            {
                header: 'Slug',
                accessorKey: 'slug',
            },
            {
                header: 'SEO Score',
                accessorKey: 'seo-score',
            },
        ],
        [],
    );

    useEffect(() => {
        const res = axios.get("http://localhost:8080/posts").then(res => {
            const x = res.data.map(pages => ({
                    ...pages,
                    "seo-score": getSEOScore(pages) + "%",
                }
            ))
            setPages(x);
        })
    }, []);

    return (
        <>
            <Sidebar title={"Pages"}/>
            <Container>
                <Row>
                    <ContentTableView type={1} columns={columns} data={pages} pagination={"Posts"} />
                </Row>
            </Container>
        </>
    )
}