import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {Link, Route, useNavigate} from "react-router-dom";

import Sidebar from "../components/sidebar/Sidebar";
import Container from "react-bootstrap/Container";
import {Row} from "react-bootstrap";
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
export default function ViewPages () {

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

        const res = axios.get("http://localhost:8080/pages").then(res => {
            if(!res.data) return;
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
                    <ContentTableView type={0} columns={columns} data={pages} pagination={"Pages"} />
                </Row>
                </Container>
        </>
    )
}