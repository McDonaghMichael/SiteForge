import Sidebar from "../components/sidebar/Sidebar";
import {Row} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

export default function AccountsPage() {

    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const res = axios.get("http://localhost:8080/users").then(res => {
            setAccounts(res.data);
        })
    }, []);

    console.log(accounts);
    return (
        <>
            <Sidebar title={"Accounts"}/>
            <Container>
                <Row>
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Username</th>
                            <th scope="col">Email</th>
                            <th scope="col">Role</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {accounts.map((account, index) => (
                            <tr>
                                <th scope="row">{index}</th>
                                <td>{account.FirstName}</td>
                                <td>{account.LastName}</td>
                                <td>{account.Username}</td>
                                <td>{account.Email}</td>
                                <td>Admin</td>
                                <td>
                                    <Link to={`/admin/account/edit/` + index}>
                                        <button className="btn btn-outline-primary">Edit</button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </Row>
            </Container>
        </>
    );
};