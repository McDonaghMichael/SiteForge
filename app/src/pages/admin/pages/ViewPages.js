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
export default function ViewPages () {

    const [pages, setPages] = useState([]);

    const navigate = useNavigate();

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

            const x = res.data.map(pages => ({
                    ...pages,
                    "seo-score": getSEOScore(pages) + "%",
                }
            ))
            setPages(x);
        })


    }, []);


    const table = useMaterialReactTable({
        columns,
        data: pages,
        enableRowSelection: true,
        enableColumnOrdering: true,
        enableGlobalFilter: false,
        enableRowActions: true,
        paginationDisplayMode: 'pages',
        initialState: {
            showColumnFilters: true,
            showGlobalFilter: true,
            columnPinning: {
                left: ['mrt-row-expand', 'mrt-row-select'],
                right: ['mrt-row-actions'],
            },
        },
        renderRowActionMenuItems: ({ row }) => [
            <MenuItem
                key={0}
                onClick={() => {
                    console.log(row.original.slug)
                    navigate(`/${row.original.slug}`)
                }}
                sx={{ m: 0 }}
            >
                <ListItemIcon>
                    <PhonelinkIcon />
                </ListItemIcon>
                Visit Page
            </MenuItem>,
            <MenuItem
                key={0}
                onClick={() => {
                    console.log(row.original.slug)
                    navigate(`/admin/page/edit/${row.id}`)
                }}
                sx={{ m: 0 }}
            >
                <ListItemIcon>
                    <EditIcon />
                </ListItemIcon>
                Edit Page
            </MenuItem>,
        ],
    });

    return (
        <>
            <Sidebar title={"Pages"}/>
            <Container>
                <Row>
                    <MaterialReactTable table={table} />
                </Row>
                </Container>
        </>
    )
}