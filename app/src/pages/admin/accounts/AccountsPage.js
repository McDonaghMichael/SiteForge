import Sidebar from "../components/sidebar/Sidebar";
import {Col, Row} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {ListItemIcon, MenuItem} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteModal from "../components/content/DeleteModal";
import ContentTableView from "../components/content/ContentTableView";
import LoggerPieChart from "../components/statistics/LoggerPieChart";

export default function AccountsPage() {

    const [accounts, setAccounts] = useState([]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const handleDelete = async () => {
        return axios.post("http://localhost:8080/account/delete", selectedAccount, {
            headers: {
                "Content-Type": "application/json",
            },
        }).then(() => {
            fetchData();
        });
    };

    const openDeleteModal = (account) => {
        setSelectedAccount(account);
        setShowDeleteModal(true);
    };

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
        enableRowSelection: false,
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

    const fetchData = async () => {
        const res = axios.get("http://localhost:8080/accounts").then(res => {
            setAccounts(res.data);
        })
    };
    useEffect(() => {
       fetchData();
    }, []);

    const deleteAccount = (account) => {
        openDeleteModal(account);
        setSelectedAccount(account.original);
    }

    return (
        <>
            <Sidebar title={"Accounts"}/>
            <DeleteModal show={showDeleteModal} handleClose={() => setShowDeleteModal(false)} title="Account Deletion" body="Are you sure you would like to delete this account? It cannot be undone." confirmAction={handleDelete} />
            <Container>
                <Row>
                    <Col>
                        <MaterialReactTable table={table} />
                    </Col>
                    <Col xs={3}>
                        <LoggerPieChart index={2}/>
                    </Col>
                </Row>
            </Container>
        </>
    );
};