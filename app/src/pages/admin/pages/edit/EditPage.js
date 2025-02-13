import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import {Alert, Row} from "react-bootstrap";

export default function EditPage () {

    const [page, setPage] = useState([]);
    const [data, setData] = useState([{"title":"","html":"","css":"","slug":"","status":0,"date":"","created_by":"","featured-image":"","meta_title":"","meta_description":"","meta_keywords":""}]);
    const { id } = useParams();
    const [oldData, setOldData] = useState({});
    const [pageEdited, setPageEdited] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const res = axios.get("http://localhost:8080/pages").then(res => {
            setPage(res.data[id]);
            setData(res.data[id]);
            setOldData(res.data[id]);
        })
    }, []);

    const handleChanges = async (e) => {
        e.preventDefault();
        setPageEdited(false)
        setError(false);

        try {
            data.oldSlug = oldData.slug;
            const response = await axios.post("http://localhost:8080/page/edit", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("Server Response:", response.data);
            setPageEdited(true)
        } catch (error) {
            console.error("Upload error:", error);
            setError(true);
            setErrorMessage(error.message);
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
            <Sidebar title={"Edit Page"}/>
            <Container>
                <Row>
                    {pageEdited && (
                        <Alert key="success" variant="success">
                            Page has been updated. You can visit it <a href={`/${data.slug}`}>HERE</a>.
                        </Alert>

                    )}
                    {errorMessage && (
                        <Alert key="error" variant="error">
                            An error has occurred, please try again. {errorMessage}
                        </Alert>

                    )}
            <Form onSubmit={handleChanges}>
                <Form.Group className="mb-3" controlId="title">
                    <Form.Text>Title</Form.Text>
                    <Form.Control type="text" id="title" name="title" value={data.title || ""} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="slug">
                    <Form.Text>Slug</Form.Text>
                    <Form.Control type="text" id="slug" name="slug" value={data.slug || ""} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="html">
                    <Form.Text>HTML</Form.Text>
                    <Form.Control as="textarea" id="html" name="html" value={data.html || ""} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="css">
                    <Form.Text>CSS</Form.Text>
                    <Form.Control as="css" id="css" name="css" value={data.css || ""} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="meta_title">
                    <Form.Text>Meta Title</Form.Text>
                    <Form.Control type="text" id="metatitle" name="meta_title" value={data.meta_title || ""} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="meta_description">
                    <Form.Text>Meta Description</Form.Text>
                    <Form.Control type="text" id="metadescription" name="meta_description" value={data.meta_description || ""} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="meta_keywords">
                    <Form.Text>Meta Keywords</Form.Text>
                    <Form.Control type="text" id="metakeywords" name="meta_keywords" value={data.meta_keywords || ""} onChange={handleInputChange} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
                </Row>
            </Container>
        </>
    );
}