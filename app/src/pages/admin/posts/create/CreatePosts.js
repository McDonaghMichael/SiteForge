import Sidebar from "../../components/sidebar/Sidebar";
import {useState} from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import {Alert, Card, Col, ProgressBar, Row} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ModalsComponent from "../../components/informative/ModalsComponent";
import ContentForm from "../../components/content/ContentForm";
import ContentInformation from "../../components/content/ContentInformation";
import SEOAnalyser from "../../components/seo/SEOAnalyser";
import AlertsComponent from "../../components/informative/AlertsComponent";

export default function CreatePosts () {

    const [data, setData] = useState({ html: "<span></span>" });
    const [postCreated, setPageCreated] = useState(false);
    const [postContent, setPostContent] = useState(null);
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
                    <Col>
                        <ModalsComponent
                            enabled={postCreated}
                            title={"Post Created"}
                            body={"Post has been successfully created."}
                            link={`/posts/${data.slug}`}
                        />
                        <AlertsComponent
                            enabled={error}
                            key="danger"
                            variant="danger"
                            message={`An error has occurred, please try again. ${errorMessage}`}
                        ></AlertsComponent>
                        <Card>
                            <Card.Header>Post Editor</Card.Header>
                            <Card.Body>
                                <ContentForm data={data} pageContent={postContent} submissionHandler={handleChanges} setPageContent={setPostContent} setData={setData}  />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={3}>
                        <ContentInformation data={data} />
                        <br />
                        <SEOAnalyser data={data} />
                    </Col>
                </Row>
            </Container>


        </>
    );
}