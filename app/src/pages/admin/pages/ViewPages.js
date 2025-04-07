import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {Link, Route, useNavigate} from "react-router-dom";

import Sidebar from "../components/sidebar/Sidebar";
import Container from "react-bootstrap/Container";
import {Card, Col, Row} from "react-bootstrap";
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import {Box, ListItemIcon, MenuItem} from "@mui/material";
import {AccountCircle, PagesOutlined, Send} from "@mui/icons-material";
import EditIcon from '@mui/icons-material/Edit';
import PhonelinkIcon from '@mui/icons-material/Phonelink';
import {getSEOScore} from "../components/seo/SEOAnalyserData";
import ContentTableView from "../components/content/ContentTableView";
import AlertsComponent from "../components/informative/AlertsComponent";
import LoggerPieChart from "../components/statistics/LoggerPieChart";
import Button from "react-bootstrap/Button";
export default function ViewPages () {

    const [pages, setPages] = useState([])

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

        const res = axios.get("http://localhost:8080/pages").then(res => {
            if(!res.data) return;
            const x = res.data.map(pages => ({
                    ...pages,
                    "seo-score": getSEOScore(pages) + "%",
                }
            ))
            setPages(x);
        })

    }, [updated]);

    const trigger = () => {
        setUpdated(!updated);
    }

    return (
        <>
            <Sidebar title={"Pages"}/>
            <Container>
                <Row>
                    <Col>
                        <ContentTableView type={0} columns={columns} data={pages} pagination={"Pages"} trigger={trigger}  />
                    </Col>
                    <Col xs={3}>
                        <LoggerPieChart index={0}/>
                    </Col>
                </Row>
            </Container>
        </>
    )
}