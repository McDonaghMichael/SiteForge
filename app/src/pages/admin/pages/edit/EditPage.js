import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

export default function EditPage () {

    const [page, setPage] = useState([]);
    const [data, setData] = useState([{"title":"","html":"","css":"","slug":"","status":0,"date":"","created_by":"","featured-image":"","meta_title":"","meta_description":"","meta_keywords":""}]);
    const { id } = useParams();
    const [oldData, setOldData] = useState({});

    useEffect(() => {
        const res = axios.get("http://localhost:8080/pages").then(res => {
            setPage(res.data[id]);
            setData(res.data[id]);
            setOldData(res.data[id]);
        })
    }, []);

    const handleChanges = async (e) => {
        e.preventDefault();

        try {
            data.oldSlug = oldData.slug;
            const response = await axios.post("http://localhost:8080/page/edit", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("Server Response:", response.data);
        } catch (error) {
            console.error("Upload error:", error);
        }
    };

    const handleInputChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <form onSubmit={handleChanges}>
                <label htmlFor="title">Page Title</label><br/>
                <input type="text" id="title" name="title" value={data.title || ""} onChange={handleInputChange}/><br/>

                <label htmlFor="slug">Slug</label><br/>
                <input type="text" id="slug" name="slug" value={data.slug || ""} onChange={handleInputChange}/><br/>

                <label htmlFor="html">HTML</label><br/>
                <textarea id="html" name="html" value={data.html || ""} onChange={handleInputChange}/><br/>

                <label htmlFor="css">Custom CSS</label><br/>
                <textarea id="css" name="css" value={data.css || ""} onChange={handleInputChange}/><br/>

                <label htmlFor="metatitle">Meta Title</label><br/>
                <input type="text" id="metatitle" name="meta_title" value={data.meta_title || ""} onChange={handleInputChange}/><br/>

                <label htmlFor="metadescription">Meta Description</label><br/>
                <input type="text" id="metadescription" name="meta_description" value={data.meta_description || ""} onChange={handleInputChange}/><br/>

                <label htmlFor="metakeywords">Meta Keywords</label><br/>
                <input type="text" id="metakeywords" name="meta_keywords" value={data.meta_keywords || ""} onChange={handleInputChange}/><br/>

                <label htmlFor="featuredimage">Featured Image</label><br/>
                {data.featuredimage && <img src={data.featuredimage} alt="Featured" width="200"/>}<br/>

                <button type="submit">Update Page</button>
            </form>
        </>
    );
}