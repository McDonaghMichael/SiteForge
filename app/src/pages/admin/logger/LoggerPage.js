import Sidebar from "../components/sidebar/Sidebar";
import DeleteModal from "../components/content/DeleteModal";
import Container from "react-bootstrap/Container";
import {Row} from "react-bootstrap";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {useEffect, useMemo, useState} from "react";
import axios from "axios";

export default function LoggerPage(){

    const [data, setData] = useState({});

    const categoryMappings = {
        0: "Page",
        1: "Post",
        2: "Theme",
        3: "Account",
        4: "Settings"
    };

    const statusMappings = {
        0: "Fail",
        1: "Success",
    };

    const actionMappings = {
        0: "Deleted",
        1: "Updated",
        2: "Created",
        3: "Fetch"
    };

const columns = useMemo(
    () => [
        {
            header: 'Category',
            accessorKey: 'category',
            Cell: ({ cell }) => categoryMappings[cell.getValue()] || cell.getValue()
        },
        {
            header: 'Status',
            accessorKey: 'statuscode',
            Cell: ({ cell }) => statusMappings[cell.getValue()] || cell.getValue()
        },
        {
            header: 'Message',
            accessorKey: 'message',
        },
        {
            header: 'Action',
            accessorKey: 'actioncode',
            Cell: ({ cell }) => actionMappings[cell.getValue()] || cell.getValue()
        },
        {
            header: 'Timestamp',
            accessorKey: 'timestamp',
        },
    ],
    [],
);

const table = useMaterialReactTable({
    columns,
    data: data ?? [],
    enableRowSelection: false,
    enableColumnOrdering: true,
    enableGlobalFilter: false,
    enableRowActions: false,
    paginationDisplayMode: "Logger",
    initialState: {
        showColumnFilters: true,
        showGlobalFilter: true,
        columnPinning: {
            left: ['mrt-row-expand', 'mrt-row-select'],
            right: ['mrt-row-actions'],
        },
    },
});


    useEffect(() => {
        const res = axios.get("http://185.81.166.93:8182/logs").then(res => {
            setData(res.data);
        })
    }, []);

    return (
        <>
            <Sidebar title={"Logger"}/>
            <Container>
                <Row>
                    <MaterialReactTable table={table} />
                </Row>
            </Container>
        </>
    )
}