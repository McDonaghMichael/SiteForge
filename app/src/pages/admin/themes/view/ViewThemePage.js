import {useEffect, useState} from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import {Link, useParams} from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";

export default function ViewThemePage () {

    const [theme, setTheme] = useState([]);

    const { id } = useParams();

    useEffect(() => {
        axios.get("http://localhost:8080/theme")
            .then(res => {
                setTheme(res.data[id]);
            })
            .catch(error => {
                console.error("Error fetching theme:", error);
            });
    }, []);

    useEffect(() => {
        console.log("Theme updated:", theme);
    }, [theme]);


    return (
        <>
            <Sidebar title={"View Theme"}/>
            <table className="table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{theme.name}</td>
                    <td>{theme.description}</td>
                </tr>
                </tbody>
            </table>
        </>
    )
}