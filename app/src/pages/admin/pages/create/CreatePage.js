import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import {Alert, ProgressBar, Row} from "react-bootstrap";
import AlertsComponent from "../../components/alerts/AlertsComponent";
import SeoProgressBarComponent from "../../components/seo/SEOProgressBarComponent";

export default function CreatePage () {

    // Data related to the contents of the page such as title, meta-data, etc
    const [data, setData] = useState([]);

    // Whether the page has been created yet
    const [pageCreated, setPageCreated] = useState(false);

    // If any error occurs we will handle it with a boolean and a message to be displayed
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    /**
     * Method used to handle the submission of form data to the server
     * @param e
     * @returns {Promise<void>}
     */
    const formSubmissionHandler = async (e) => {
        e.preventDefault(); // Prevents submission of the form

        // Since we can submit form multiple times each time we just reset the error and page creation back to defaults
        setError(false);
        setPageCreated(false);
        
        // The type of page created has to also be parsed as an int or else it will be sent as a string
        data.type = parseInt(data.type);
        
        // We can now use a try-catch to ensure that if the data is not sent that we will handle it correctly
        try {
            const response = await axios.post("http://localhost:8080/page/create", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("Server Response:", response.data);
            setPageCreated(true);
        } catch (error) {
            console.error("Upload error:", error);
            setError(true);
            setErrorMessage(error.message);
        }
    };

    /**
     * Since the form data is being updated everytime the user interacts we should be able to update those changes
     * in our page data array
     * @param e
     */
    const handleFormDataInputChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <Sidebar title={"Create Page"}/>
            <Container>
                <Row>

                    <AlertsComponent enabled={pageCreated} key="success" variant="success" message={"Page has been created successfully"}></AlertsComponent>
                    <AlertsComponent enabled={error} key="danger" variant="danger" message={`An error has occurred, please try again. ${errorMessage}`}></AlertsComponent>

                    <Form onSubmit={formSubmissionHandler}>
                        <Form.Group className="mb-3" controlId="title">
                            <Form.Text>Title</Form.Text>
                            <Form.Control type="text" id="title" name="title" value={data.title || ""} onChange={handleFormDataInputChange} />
                            <SeoProgressBarComponent title={data.title}></SeoProgressBarComponent>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="slug">
                            <Form.Text>Slug</Form.Text>
                            <Form.Control type="text" id="slug" name="slug" value={data.slug || ""} onChange={handleFormDataInputChange} />
                            <SeoProgressBarComponent title={data.slug}></SeoProgressBarComponent>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="html">
                            <Form.Text>HTML</Form.Text>
                            <Form.Control as="textarea" id="html" name="html" value={data.html || ""} onChange={handleFormDataInputChange} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="meta_title">
                            <Form.Text>Meta Title</Form.Text>
                            <Form.Control type="text" id="metatitle" name="meta_title" value={data.meta_title || ""} onChange={handleFormDataInputChange} />
                            <SeoProgressBarComponent meta_title={data.meta_title}></SeoProgressBarComponent>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="meta_description">
                            <Form.Text>Meta Description</Form.Text>
                            <Form.Control type="text" id="metadescription" name="meta_description" value={data.meta_description || ""} onChange={handleFormDataInputChange} />
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
                            <Form.Control type="text" id="metakeywords" name="meta_keywords" value={data.meta_keywords || ""} onChange={handleFormDataInputChange} />
                            <SeoProgressBarComponent meta_keywords={data.meta_keywords}></SeoProgressBarComponent>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="templates">
                            <Form.Text>Page Template</Form.Text>
                            <Form.Select aria-label="Page Template" required={true} value={data.type} id="type" name="type" onChange={handleFormDataInputChange}>
                                <option value="0">None</option>
                                <option value="1">Standard</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="css">
                            <Form.Text>Optional CSS</Form.Text>
                            <Form.Control as="textarea" id="css" name="css" value={data.css || ""} onChange={handleFormDataInputChange} />
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