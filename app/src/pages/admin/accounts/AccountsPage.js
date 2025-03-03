import Sidebar from "../components/sidebar/Sidebar";
import {Row} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {ListItemIcon, MenuItem} from "@mui/material";
import PhonelinkIcon from "@mui/icons-material/Phonelink";
import EditIcon from "@mui/icons-material/Edit";

export default function AccountsPage() {

    const [accounts, setAccounts] = useState([]);

    var navigate = useNavigate();

    const columns = useMemo(
        () => [
            {
                header: 'First Name',
                accessorKey: 'first_name',
            },
            {
                header: 'Last Name',
                accessorKey: 'last_name',
            },
            {
                header: 'Username',
                accessorKey: 'username',
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data: accounts,
        enableRowSelection: true,
        enableColumnOrdering: true,
        enableGlobalFilter: false,
        enableRowActions: true,
        paginationDisplayMode: "Accounts",
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
                key="edit"
                onClick={() => navigate(`/`)}
                sx={{ m: 0 }}
            >
                <ListItemIcon>
                    <EditIcon />
                </ListItemIcon>
                Edit Account
            </MenuItem>,
        ],
    });

    useEffect(() => {
        const res = axios.get("http://localhost:8080/accounts").then(res => {
            setAccounts(res.data);
        })
    }, []);

    return (
        <>
            <Sidebar title={"Accounts"}/>
            <Container>
                <Row>
                    <MaterialReactTable table={table} />
                </Row>
            </Container>
        </>
    );
};