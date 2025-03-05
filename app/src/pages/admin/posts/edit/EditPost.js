import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import {Alert, Card, Col, ListGroup, ProgressBar, Row} from "react-bootstrap";
import AlertsComponent from "../../components/informative/AlertsComponent";
import ContentEditor from "../../components/content/ContentEditor";
import PostInformation from "../../components/content/ContentInformation";
import SEOAnalyser from "../../components/seo/SEOAnalyser";
import ContentInformation from "../../components/content/ContentInformation";
import ContentForm from "../../components/content/ContentForm";
import ModalsComponent from "../../components/informative/ModalsComponent";

export default function EditPost () {

    const [post, setPost] = useState([]);
    const [data, setData] = useState([]);
    const [postContent, setPostContent] = useState(null);
    const { id } = useParams();
    const [oldData, setOldData] = useState({});
    const [postEdited, setPostEdited] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const res = axios.get("http://localhost:8080/posts").then(res => {
            setPost(res.data[id]);
            setData(res.data[id]);
            setOldData(res.data[id]);

        })
    }, []);

    const handleChanges = async (e) => {
        e.preventDefault();
        setPostEdited(false)

        setError(false);

        try {
            data.oldSlug = oldData.slug;
            data.html = postContent.html;


            console.log(data);
            const response = await axios.post("http://localhost:8080/post/edit", data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("Server Response:", response.data);
            setPostEdited(true)
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

    const handleContentChange = (content) => {
        setPostContent({
            html: content,
        });
    };

    return (
        <>
            <Sidebar title={"Edit Post"}/>
            <Container>
                <Row>
                    <ModalsComponent
                        enabled={postEdited}
                        title={"Post Updated"}
                        body={"Post has been successfully updated."}
                        link={`/posts/${data.slug}`}
                    />
                    <AlertsComponent
                        enabled={error}
                        key="danger"
                        variant="danger"
                        message={`An error has occurred, please try again. ${errorMessage}`}
                    ></AlertsComponent>
                    <Col>
                        <Card>
                            <Card.Header>Post Editor</Card.Header>
                            <Card.Body>
                                <ContentForm data={data} pageContent={postContent} submissionHandler={handleChanges} setPageContent={setPostContent} setData={setData}  />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs={3}>
                        <ContentInformation data={data} slug={`/posts/${data.slug}`} />
                        <br />
                        <SEOAnalyser data={data} />
                    </Col>
                </Row>
            </Container>
        </>
    );
}