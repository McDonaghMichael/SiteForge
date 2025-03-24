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
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteModal from "./DeleteModal";

export default function AccountsPage() {

    const [accounts, setAccounts] = useState([]);

    const [show, setShow] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
        data: accounts ?? [],
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
                onClick={() => navigate(`/admin/account/edit/${row.original._id}`)}
                sx={{ m: 0 }}
            >
                <ListItemIcon>
                    <EditIcon />
                </ListItemIcon>
                Edit
            </MenuItem>,
            <MenuItem
                key="delete"
                onClick={() => deleteAccount(row)}
                sx={{ m: 0 }}
            >
                <ListItemIcon>
                    <DeleteIcon />
                </ListItemIcon>
                Delete
            </MenuItem>,
        ],
    });

    useEffect(() => {
        const res = axios.get("http://localhost:8080/accounts").then(res => {
            setAccounts(res.data);
        })
    }, []);

    const deleteAccount = (account) => {
        setShow(true)
        setSelectedAccount(account.original);
    }

    return (
        <>
            <Sidebar title={"Accounts"}/>
            <DeleteModal handleClose={handleClose} show={show} onClose={handleClose} account={selectedAccount} />
            <Container>
                <Row>
                    <MaterialReactTable table={table} />
                </Row>
            </Container>
        </>
    );
};