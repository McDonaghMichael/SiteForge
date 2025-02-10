import {useEffect, useState} from "react";
import axios from "axios";
import {Route} from "react-router-dom";
import BasePage from "../../../global/base/BasePage";

export default function ViewPages () {

    const [pages, setPages] = useState([]);

    useEffect(() => {
        const res = axios.get("http://localhost:8080/pages").then(res => {
            setPages(res.data);
        })
    }, []);

    return (
        <>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">Slug</th>
                    <th scope="col">Status</th>
                    <th scope="col">Created By</th>
                    <th scope="col">Created Date</th>
                    <th scope="col">Actions</th>
                </tr>
                </thead>
                <tbody>
                    {pages.map((item, index) => (
                        <tr>
                            <th scope="row">1</th>
                            <td>{item.title}</td>
                            <td>{item.slug}</td>
                            <td>{item.status}</td>
                            <td>user</td>
                            <td>10/02/2025</td>
                            <td>
                            <button className="btn btn-info">View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}