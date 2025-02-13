import {useEffect, useState} from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import {Row} from "react-bootstrap";
import Container from "react-bootstrap/Container";

export default function ThemesPage (){

    const [themes, setThemes] = useState([]);


    useEffect(() => {
        axios.get("http://localhost:8080/theme")
            .then(res => {
                setThemes(res.data);
            })
            .catch(error => {
                console.error("Error fetching theme:", error);
            });
    }, []);

    useEffect(() => {
        console.log("Theme updated:", themes);
    }, [themes]);


    return (
        <>
            <Sidebar title={"Themes"}/>
            <Container>
                <Row>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>State</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {themes.map((item, index) => (
                            <tr>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>Enabled</td>
                                <td><Link to={`/admin/theme/view/` + index}>
                                    <button className="btn btn-outline-primary">View</button>
                                </Link></td>
                            </tr>
                        ))}

                        </tbody>
                    </table>
                </Row>
            </Container>

        </>
    )
}