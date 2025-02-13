import {useEffect, useState} from "react";
import axios from "axios";
import {Link, Route} from "react-router-dom";
import BasePage from "../../global/base/BasePage";
import Button from "react-bootstrap/Button";
import Sidebar from "../components/sidebar/Sidebar";
import Container from "react-bootstrap/Container";
import {Row} from "react-bootstrap";

export default function ViewPages () {

    const [pages, setPages] = useState([]);

    useEffect(() => {
        const res = axios.get("http://localhost:8080/pages").then(res => {
            setPages(res.data);
        })
    }, []);

    return (
        <>
            <Sidebar title={"Pages"}/>
            <Container>
                <Row>
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
                            <th scope="row">{index}</th>
                            <td>{item.title}</td>
                            <td><code>{item.slug}</code></td>
                            <td>{item.status}</td>
                            <td>user</td>
                            <td>{item.date}</td>
                            <td>
                                <Link to={`/admin/page/edit/` + index}>
                                    <button className="btn btn-outline-primary">View</button>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
                </Row>
                </Container>
        </>
    )
}