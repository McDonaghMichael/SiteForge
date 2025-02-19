import {useEffect, useState} from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Container from "react-bootstrap/Container";
import {Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ThemePreview from "../../components/themes/ThemePreview";

export default function ImportThemePage (){

    const [jsonData, setJsonData] = useState(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsedData = JSON.parse(e.target.result);
                setJsonData(parsedData);
                console.log("Parsed JSON Data:", parsedData);
            } catch (error) {
                console.error("Invalid JSON file:", error);
                alert("Error: Invalid JSON file format!");
            }
        };
        reader.readAsText(file);
    };

    const handleUpload = async () => {
        if (!jsonData) {
            alert("No JSON data to upload!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/theme/import", jsonData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            alert("JSON uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload JSON!");
        }
    };

    return (
        <>
            <Sidebar title={"Import Theme"}/>
            <Container>
                <Row>
                    <Form>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Please upload a JSON File with the supported format</Form.Label>
                            <Form.Control type="file" accept=".json" onChange={handleFileUpload}/>
                            <br/>
                            <Button onClick={handleUpload} disabled={!jsonData} className="btn btn-primary">Upload to Website</Button>
                        </Form.Group>
                    </Form>
                    {jsonData instanceof Object && (
                        <div className="container">
                            <Row>
                                <h4>Navbar</h4>
                                <ThemePreview css={jsonData.css} html={jsonData.navbar} />
                            </Row>
                            <Row>
                                <h4>Footer</h4>
                                <ThemePreview css={jsonData.css} html={jsonData.footer} />
                            </Row>
                            <Row>
                                <h4>CSS</h4>
                                <code>{jsonData.css}</code>
                            </Row>

                        </div>
                    )}

                </Row>
            </Container>

        </>
    )
}