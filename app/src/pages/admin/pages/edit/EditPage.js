import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { Alert, Card, Col, ListGroup, ProgressBar, Row } from "react-bootstrap";
import SEOAnalyserData from "../../components/seo/SEOAnalyserData";
import SEOAnalyser from "../../components/seo/SEOAnalyser";
import AlertsComponent from "../../components/alerts/AlertsComponent";
import PageInformation from "../../components/page/PageInformation";
import ContentEditor from "../../components/ContentEditor";

export default function EditPage() {
  const [page, setPage] = useState([]);

  const [pageContent, setPageContent] = useState(null);
  const [data, setData] = useState([]);
  const { id } = useParams();
  const [oldData, setOldData] = useState({});
  const [pageEdited, setPageEdited] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const res = axios.get("http://localhost:8080/pages").then((res) => {
      setPage(res.data[id]);
      setData(res.data[id]);
      setOldData(res.data[id]);
    });
  }, []);

  const handleChanges = async (e) => {
    e.preventDefault();
    setPageEdited(false);
    setError(false);

    try {
      data.oldSlug = oldData.slug;
      data.type = parseInt(data.type);
      data.html = pageContent.html;


      console.log(data);
      const response = await axios.post(
        "http://localhost:8080/page/edit",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      console.log("Server Response:", response.data);
      setPageEdited(true);
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

    const handleContentChange = (content) => {
        setPageContent({
            html: content,
        });
    };

  return (
    <>
      <Sidebar title={"Edit Page"} />
      <Container>
        <Row>
          <AlertsComponent
            enabled={pageEdited}
            key="success"
            variant="success"
            message={"Page has been updated successfully"}
          ></AlertsComponent>
          <AlertsComponent
            enabled={error}
            key="danger"
            variant="danger"
            message={`An error has occurred, please try again. ${errorMessage}`}
          ></AlertsComponent>
          <Col>
            <Card>
              <Card.Header>Page Editor</Card.Header>
              <Card.Body>
                <Form onSubmit={handleChanges}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <Form.Group className="mb-3" controlId="title">
                        <Form.Text>Title</Form.Text>
                        <Form.Control
                          type="text"
                          id="title"
                          name="title"
                          value={data.title || ""}
                          onChange={handleInputChange}
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
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Form.Group className="mb-3" controlId="html">
                        <Form.Text>Content</Form.Text>
                          <ContentEditor form={data} onChange={handleContentChange} html={data.html} />
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
                          onChange={handleInputChange}
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
                          onChange={handleInputChange}
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
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Form.Group className="mb-3" controlId="templates">
                        <Form.Text>Page Template</Form.Text>
                        <Form.Select
                          aria-label="Page Template"
                          required={true}
                          value={data.type}
                          id="type"
                          name="type"
                          onChange={handleInputChange}
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
                          onChange={handleInputChange}
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
              </Card.Body>
            </Card>
          </Col>
          <Col xs={3}>
            <PageInformation data={data} />
            <br />
            <SEOAnalyser data={data} />
          </Col>
        </Row>
      </Container>
    </>
  );
}
