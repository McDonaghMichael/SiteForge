import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {Link, Route} from "react-router-dom";
import BasePage from "../../global/base/BasePage";
import Button from "react-bootstrap/Button";
import Sidebar from "../components/sidebar/Sidebar";
import Container from "react-bootstrap/Container";
import {Col, Row} from "react-bootstrap";
import {getSEOScore} from "../components/seo/SEOAnalyserData";
import ContentTableView from "../components/content/ContentTableView";
import LoggerPieChart from "../components/statistics/LoggerPieChart";

export default function ViewPPosts () {

    const [posts, setPosts] = useState([]);

    const [updated, setUpdated] = useState(false);

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
            if(!res.data) return;
            const x = res.data.map(posts => ({
                    ...posts,
                    "seo-score": getSEOScore(posts) + "%",
                }
            ))
            setPosts(x);
        })
    }, [updated]);

    const trigger = () => {
        setUpdated(!updated);
    }

    return (
        <>
            <Sidebar title={"Posts"}/>
            <Container>
                <Row>
                    <Col>
                        <ContentTableView type={1} columns={columns} data={posts} pagination={"Posts"} trigger={trigger} />
                    </Col>
                    <Col xl={3}>
                        <LoggerPieChart index={1}/>
                    </Col>
                </Row>
            </Container>
        </>
    )
}