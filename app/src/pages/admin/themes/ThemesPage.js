import {useEffect, useState} from "react";
import axios from "axios";

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
            <h1>Themes</h1>
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
                        <td><button>View</button></td>
                    </tr>
                ))}

                </tbody>
            </table>
        </>
    )
}