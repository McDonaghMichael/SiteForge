import Sidebar from "../../components/sidebar/Sidebar";
import {useState} from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import {Alert, ProgressBar, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ModalsComponent from "../../components/informative/ModalsComponent";

export default function CreatePosts () {

    const [data, setData] = useState([]);
    const [pageCreated, setPageCreated] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChanges = async (e) => {
        e.preventDefault();
        setError(false);
        setPageCreated(false);
        data.type = parseInt(data.type);
        try {
            const response = await axios.post("http://localhost:8080/post/create", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("Server Response:", response.data);
            setPageCreated(true);
        } catch (error) {
            console.error("Upload error:", error);
            setError(true);
            setErrorMessage(error.response.data);
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
            <Sidebar title={"Create Post"}/>
            <Container>
                <Row>
                    <ModalsComponent enabled={pageCreated} title={"Post Created"} body={"Post has been successfully created."} link={`/posts/${data.slug}`}/>
                    {error && (
                        <Alert key="danger" variant="danger">
                            {errorMessage}
                        </Alert>

                    )}
                    <Form onSubmit={handleChanges}>
                        <Form.Group className="mb-3" controlId="title">
                            <Form.Text>Title</Form.Text>
                            <Form.Control type="text" id="title" name="title" value={data.title || ""} onChange={handleInputChange} />
                            {data.title && data.title.length <= 30 &&(
                                <>
                                    <ProgressBar variant="info" now={(data.title.length / 30) * 100}/>
                                </>
                            )}
                            {data.title && data.title.length > 30 && data.title.length < 60 && (
                                <>
                                    <ProgressBar variant="warning" now={(data.title.length / 30) * 100}/>
                                    <br/>
                                    <Alert key="warning" variant="warning">According to best SEO practices we recommend keeping your character limited between 30-60 at a maximum</Alert>
                                </>
                            )}
                            {data.title && data.title.length >= 60 && (
                                <>
                                    <ProgressBar variant="danger" now={(data.title.length / 30) * 100}/>
                                    <br/>
                                    <Alert key="danger" variant="danger">Avoid going above 60 characters as it could make the title hidden to some searchers</Alert>
                                </>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="slug">
                            <Form.Text>Slug</Form.Text>
                            <Form.Control type="text" id="slug" name="slug" value={data.slug || ""} onChange={handleInputChange} />
                            {data.slug && data.slug.length <= 15 &&(
                                <>
                                    <ProgressBar variant="info" now={(data.slug.length / 15) * 100}/>
                                </>
                            )}
                            {data.slug && data.slug.length > 15 && data.slug.length < 20 && (
                                <>
                                    <ProgressBar variant="warning" now={(data.slug.length / 15) * 100}/>
                                    <br/>
                                    <Alert key="warning" variant="warning">Best SEO Practices recommend keeping your slug between 10-15 characters</Alert>
                                </>
                            )}
                            {data.slug && data.slug.length >= 20 && (
                                <>
                                    <ProgressBar variant="danger" now={(data.slug.length / 15) * 100}/>
                                    <br/>
                                    <Alert key="danger" variant="danger">It is not recommended to go above 20 characters as it could hinder appearing in results</Alert>
                                </>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="html">
                            <Form.Text>HTML</Form.Text>
                            <Form.Control as="textarea" id="html" name="html" value={data.html || ""} onChange={handleInputChange} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="meta_title">
                            <Form.Text>Meta Title</Form.Text>
                            <Form.Control type="text" id="metatitle" name="meta_title" value={data.meta_title || ""} onChange={handleInputChange} />
                            {data.meta_title && data.meta_title.length <= 30 &&(
                                <>
                                    <ProgressBar variant="info" now={(data.meta_title.length / 30) * 100}/>
                                </>
                            )}
                            {data.meta_title && data.meta_title.length > 30 && data.meta_title.length < 60 && (
                                <>
                                    <ProgressBar variant="warning" now={(data.meta_title.length / 30) * 100}/>
                                    <br/>
                                    <Alert key="warning" variant="warning">According to best SEO practices we recommend keeping your character limited between 30-60 at a maximum</Alert>
                                </>
                            )}
                            {data.meta_title && data.meta_title.length >= 60 && (
                                <>
                                    <ProgressBar variant="danger" now={(data.meta_title.length / 30) * 100}/>
                                    <br/>
                                    <Alert key="danger" variant="danger">Avoid going above 60 characters as it could make the meta_title hidden to some searchers</Alert>
                                </>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="meta_description">
                            <Form.Text>Meta Description</Form.Text>
                            <Form.Control type="text" id="metadescription" name="meta_description" value={data.meta_description || ""} onChange={handleInputChange} />
                            {data.meta_description && data.meta_description.length <= 80 &&(
                                <>
                                    <ProgressBar variant="info" now={(data.meta_description.length / 80) * 100}/>
                                </>
                            )}
                            {data.meta_description && data.meta_description.length > 80 && data.meta_description.length < 100 && (
                                <>
                                    <ProgressBar variant="warning" now={(data.meta_description.length / 80) * 100}/>
                                    <br/>
                                    <Alert key="warning" variant="warning">Having the meta description between 80-100 characters helps with SEO according to best practices</Alert>
                                </>
                            )}
                            {data.meta_description && data.meta_description.length >= 100 && (
                                <>
                                    <ProgressBar variant="danger" now={(data.meta_description.length / 80) * 100}/>
                                    <br/>
                                    <Alert key="danger" variant="danger">It can have a negative impact having a meta description above 100 characters as it wont be visible to some viewers</Alert>
                                </>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="meta_keywords">
                            <Form.Text>Meta Keywords</Form.Text>
                            <Form.Control type="text" id="metakeywords" name="meta_keywords" value={data.meta_keywords || ""} onChange={handleInputChange} />
                            {data.meta_keywords && data.meta_keywords.split(",").map(word => word.trim()).length <= 5 &&(
                                <>
                                    <ProgressBar variant="info" now={(data.meta_keywords.split(",").map(word => word.trim()).length / 5) * 100}/>
                                </>
                            )}
                            {data.meta_keywords && data.meta_keywords.split(",").map(word => word.trim()).length > 5 && data.meta_keywords.split(",").map(word => word.trim()).length < 7 && (
                                <>
                                    <ProgressBar variant="warning" now={(data.meta_keywords.split(",").map(word => word.trim()).length / 5) * 100}/>
                                    <br/>
                                    <Alert key="warning" variant="warning">We recommend having between 5-7 keywords at maximum</Alert>
                                </>
                            )}
                            {data.meta_keywords && data.meta_keywords.split(",").map(word => word.trim()).length >= 7 && (
                                <>
                                    <ProgressBar variant="danger" now={(data.meta_keywords.split(",").map(word => word.trim()).length / 5) * 100}/>
                                    <br/>
                                    <Alert key="danger" variant="danger">Google no longer focuses on meta keywords alot for SEO so avoid having more than 7</Alert>
                                </>
                            )}
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