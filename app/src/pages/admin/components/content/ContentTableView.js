import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {ListItemIcon, MenuItem} from "@mui/material";
import PhonelinkIcon from "@mui/icons-material/Phonelink";
import EditIcon from "@mui/icons-material/Edit";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import DeleteModal from "./DeleteModal";

export default function ContentTableView({type, columns, data, paginationTitle, trigger}) {

    const PAGE_TABLE_VIEW = 0;
    const POST_TABLE_VIEW = 1;

    const [menuItems, setMenuItems] = useState([]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedContent, setSelectedContent] = useState(null);
    const [contentType, setContentType] = useState("page");

    const handleDelete = async () => {

        trigger();
        return axios.post("http://localhost:8080/" + contentType + "/delete", selectedContent, {
            headers: {
                "Content-Type": "application/json",
            },
        });
    };

    const openDeleteModal = (id) => {
        setSelectedContent(id);
        setShowDeleteModal(true);
    };

    const deleteContent = (id, type) => {
        openDeleteModal(id);
        setSelectedContent(id.original);
        setContentType(type);
    }

    const navigate = useNavigate();

    function getMenuItems(row) {

        console.log(row);
        switch (type) {
            case PAGE_TABLE_VIEW:
                return [
                    <MenuItem
                        key="visit"
                        onClick={() => navigate(`/${row.original.slug.replace("/", "")}`)}
                        sx={{ m: 0 }}
                    >
                        <ListItemIcon>
                            <PhonelinkIcon />
                        </ListItemIcon>
                        Visit Page
                    </MenuItem>,
                    <MenuItem
                        key="edit"
                        onClick={() => navigate(`/admin/page/edit/${row.index}`)}
                        sx={{ m: 0 }}
                    >
                        <ListItemIcon>
                            <EditIcon />
                        </ListItemIcon>
                        Edit Page
                    </MenuItem>,
                    <MenuItem
                        key="delete"
                        onClick={() => deleteContent(row, "page")}
                        sx={{ m: 0 }}
                    >
                        <ListItemIcon>
                            <DeleteIcon />
                        </ListItemIcon>
                        Delete
                    </MenuItem>,
                ];
            case POST_TABLE_VIEW:
                return [
                    <MenuItem
                        key="visit"
                        onClick={() => navigate(`/posts/${row.original.slug}`)}
                        sx={{ m: 0 }}
                    >
                        <ListItemIcon>
                            <PhonelinkIcon />
                        </ListItemIcon>
                        Visit Post
                    </MenuItem>,
                    <MenuItem
                        key="edit"
                        onClick={() => navigate(`/admin/post/edit/${row.index}`)}
                        sx={{ m: 0 }}
                    >
                        <ListItemIcon>
                            <EditIcon />
                        </ListItemIcon>
                        Edit Post
                    </MenuItem>,
                    <MenuItem
                        key="delete"
                        onClick={() => deleteContent(row, "post")}
                        sx={{ m: 0 }}
                    >
                        <ListItemIcon>
                            <DeleteIcon />
                        </ListItemIcon>
                        Delete
                    </MenuItem>,
                ];
            default:
                return [];
        }
    }

    const table = useMaterialReactTable({
        columns,
        data: data,
        enableRowSelection: true,
        enableColumnOrdering: true,
        enableGlobalFilter: false,
        enableRowActions: true,
        paginationDisplayMode: paginationTitle,
        initialState: {
            showColumnFilters: true,
            showGlobalFilter: true,
            columnPinning: {
                left: ['mrt-row-expand', 'mrt-row-select'],
                right: ['mrt-row-actions'],
            },
        },
        renderRowActionMenuItems: ({ row }) => [
            getMenuItems(row)
        ],
    });

    return (
        <>
            <DeleteModal show={showDeleteModal} handleClose={() => setShowDeleteModal(false)} title="Content Deletion" body="Are you sure you would like to delete this content? It cannot be undone." confirmAction={handleDelete} />

            <MaterialReactTable table={table} />
        </>
    )
}