import {MaterialReactTable, useMaterialReactTable} from "material-react-table";
import {ListItemIcon, MenuItem} from "@mui/material";
import PhonelinkIcon from "@mui/icons-material/Phonelink";
import EditIcon from "@mui/icons-material/Edit";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function ContentTableView({type, columns, data, paginationTitle}) {

    const PAGE_TABLE_VIEW = 0;
    const POST_TABLE_VIEW = 1;

    const [menuItems, setMenuItems] = useState([]);

    const navigate = useNavigate();

    function getMenuItems(row) {

        console.log(row);
        switch (type) {
            case PAGE_TABLE_VIEW:
                return [
                    <MenuItem
                        key="visit"
                        onClick={() => navigate(`/${row.original.slug}`)}
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
            <MaterialReactTable table={table} />
        </>
    )
}