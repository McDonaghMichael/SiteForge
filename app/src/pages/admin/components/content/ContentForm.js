import {ListGroup} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import ContentEditor from "./ContentEditor";
import AIAnalyser from "../ai/AIAnalyser";
import Button from "react-bootstrap/Button";
import {useEffect, useState} from "react";

export default function ContentForm({data, pageContent, submissionHandler, setData, setPageContent}) {
    
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

    const handleContentChange = (content) => {
        setPageContent({
            html: content.html,
        });

        setData({
            ...data,
            word_count: content.text.split(" ").map(word => word.trim()).length
        });

    };


    // Replaces all white spaces with "-" as slugs cant have gaps!
    useEffect(() => {
        if (!data.slug || !data.slug.includes(" ")) return;

        setData(prevData => ({
            ...prevData,
            slug: prevData.slug.replace(/ /g, "-"),
        }));
    }, [data.slug]);


    return (
        <>
            <Form onSubmit={submissionHandler}>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <Form.Group className="mb-3" controlId="title">
                            <Form.Text>Title</Form.Text>
                            <Form.Control
                                type="text"
                                id="title"
                                name="title"
                                value={data.title || ""}
                                onChange={handleFormDataInputChange}
                                required={true}
                            />
                        </Form.Group>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Form.Group className="mb-3" controlId="slug">
                            <Form.Text>Slug</Form.Text>
                            <Form.Control
                                type="text"
                                id="slug"
                                name="slug"
                                value={data.slug || ""}
                                onChange={handleFormDataInputChange}
                                required={true}
                            />
                        </Form.Group>
                    </ListGroup.Item>
                    {data.html && (
                        <ListGroup.Item>
                            <Form.Group className="mb-3" controlId="Content">
                                <Form.Text>Content</Form.Text>
                                <ContentEditor form={data} html={data.html} onChange={handleContentChange} />

                                <Form.Text>Word Count: {data.word_count}</Form.Text>
                                <br />
                                <br />
                                <AIAnalyser data={pageContent}></AIAnalyser>
                            </Form.Group>
                        </ListGroup.Item>
                    )}
                    <ListGroup.Item>
                        <Form.Group className="mb-3" controlId="focus_keyword">
                            <Form.Text>Focus Keyword</Form.Text>
                            <Form.Control
                                type="text"
                                id="focus_keyword"
                                name="focus_keyword"
                                value={data.focus_keyword || ""}
                                onChange={handleFormDataInputChange}
                                required={true}
                            />
                        </Form.Group>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Form.Group className="mb-3" controlId="meta_title">
                            <Form.Text>Meta Title</Form.Text>
                            <Form.Control
                                type="text"
                                id="metatitle"
                                name="meta_title"
                                value={data.meta_title || ""}
                                onChange={handleFormDataInputChange}
                                required={true}
                            />
                        </Form.Group>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Form.Group className="mb-3" controlId="meta_description">
                            <Form.Text>Meta Description</Form.Text>
                            <Form.Control
                                type="text"
                                id="metadescription"
                                name="meta_description"
                                value={data.meta_description || ""}
                                onChange={handleFormDataInputChange}
                                required={true}
                            />
                        </Form.Group>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Form.Group className="mb-3" controlId="meta_keywords">
                            <Form.Text>Meta Keywords</Form.Text>
                            <Form.Control
                                type="text"
                                id="metakeywords"
                                name="meta_keywords"
                                value={data.meta_keywords || ""}
                                onChange={handleFormDataInputChange}
                                required={true}
                            />
                        </Form.Group>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Form.Group className="mb-3" controlId="templates">
                            <Form.Text>Template</Form.Text>
                            <Form.Select
                                aria-label="Template"
                                required={true}
                                value={data.type}
                                id="type"
                                name="type"
                                onChange={handleFormDataInputChange}
                            >
                                <option value="0">None</option>
                                <option value="1">Standard</option>
                            </Form.Select>
                        </Form.Group>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Form.Group className="mb-3" controlId="css">
                            <Form.Text>Optional CSS</Form.Text>
                            <Form.Control
                                as="textarea"
                                id="css"
                                name="css"
                                value={data.css || ""}
                                onChange={handleFormDataInputChange}
                            />
                        </Form.Group>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </ListGroup.Item>
                </ListGroup>
            </Form>
        </>
    )
}