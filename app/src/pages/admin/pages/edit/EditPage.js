import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

export default function EditPage () {

    const [page, setPage] = useState([]);
    const { id } = useParams();


    useEffect(() => {
        const res = axios.get("http://localhost:8080/pages").then(res => {
            setPage(res.data[id]);
        })
    }, []);

    return (
        <>
            <form>
                <label htmlFor="title">Page Title</label><br/>
                <input type="text" id="title" name="title" value={page.title}/><br/>
                <label htmlFor="slug">Slug</label><br/>
                <input type="text" id="slug" name="slug" value={page.slug}/><br/>
                <label htmlFor="html">HTML</label><br/>
                <textarea type="text" id="html" name="html" value={page.html}/><br/>
                <label htmlFor="css">Custom CSS</label><br/>
                <textarea type="text" id="css" name="css" value={page.css}/><br/>
                <label htmlFor="css">Featured Image</label><br/>

            </form>
        </>
    )
}