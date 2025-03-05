import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import {
  Alert,
  Card,
  CardBody, CardFooter,
  CardHeader,
  Col,
  ListGroup,
  ProgressBar,
  Row, Spinner,
} from "react-bootstrap";
import AlertsComponent from "../../components/informative/AlertsComponent";
import SEOAnalyserData, {getFocusKeywordCountWarning} from "../../components/seo/SEOAnalyserData";
import SEOAnalyser from "../../components/seo/SEOAnalyser";
import ContentEditor from "../../components/content/ContentEditor";
import ModalsComponent from "../../components/informative/ModalsComponent";
import OpenAI from "openai";

export default function CreatePage() {
  // Data related to the contents of the page such as title, meta-data, etc
  const [data, setData] = useState([]);

  const [pageContent, setPageContent] = useState([{html: ""}]);

  // Whether the page has been created yet
  const [pageCreated, setPageCreated] = useState(false);

  // If any error occurs we will handle it with a boolean and a message to be displayed
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [artificialIntelligenceLoading, setArtificialIntelligenceLoading] = useState(false);

  const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: 'sk-9e4ad911eab64053be7d127619320de7',
    dangerouslyAllowBrowser: true
  });

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
    data.html = pageContent.html;
    data.created_date = new Date().toLocaleDateString();
    data.updated_date = new Date().toLocaleDateString();

    // We can now use a try-catch to ensure that if the data is not sent that we will handle it correctly
    try {
      const response = await axios.post(
        "http://localhost:8080/page/create",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
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

  const handleContentChange = (content) => {
    setPageContent({
      html: content.html,
    });

    setData({
      ...data,
      word_count: content.text.split(" ").map(word => word.trim()).length
    });

  };

  const aiButton = async () => {

    setArtificialIntelligenceLoading(true);
    const completion = await openai.chat.completions.create({
      messages: [{role: "system", content: "Based on the page content below, can you update it to be much better for SEO but not drift too far from original. Please also ensure the keyword " + data.focus_keyword + " appears no more than " + getFocusKeywordCountWarning() + " times. Please only return the content and nothing else: " + data.html}],
      model: "deepseek-chat",
    });

    setPageContent({
      html: completion.choices[0].message.content,
    });

    setArtificialIntelligenceLoading(false);
    console.log(completion.choices[0].message.content);
    console.log(data.html);
  }

  return (
    <>
      <Sidebar title={"Create Page"} />
      <Container>
        <Row>
          <ModalsComponent
            enabled={pageCreated}
            title={"Page Created"}
            body={"Page has been successfully created."}
            link={`/${data.slug}`}
          />
          <AlertsComponent
            enabled={error}
            key="danger"
            variant="danger"
            message={`An error has occurred, please try again. ${errorMessage}`}
          ></AlertsComponent>
          <Col>
            <Card>
              <Card.Header>Page Creation</Card.Header>
              <Card.Body>
                <Form onSubmit={formSubmissionHandler}>
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
                        />
                      </Form.Group>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Form.Group className="mb-3" controlId="Content">
                        <Form.Text>Content</Form.Text>

                        <ContentEditor
                          form={data}
                          onChange={handleContentChange}
                          html={pageContent.html}
                          ai={artificialIntelligenceLoading}
                        />
                        <Form.Text>Word Count: {data.word_count}</Form.Text>
                        <br />
                        <br />
                        {!artificialIntelligenceLoading ? (<Button variant="outline-danger" onClick={aiButton} disabled={artificialIntelligenceLoading}>
                          Let AI Take Control
                        </Button>) : (
                            <Spinner animation="border" variant="danger" />
                        )}

                      </Form.Group>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Form.Group className="mb-3" controlId="focus_keyword">
                        <Form.Text>Focus Keyword</Form.Text>
                        <Form.Control
                          type="text"
                          id="focus_keyword"
                          name="focus_keyword"
                          value={data.focus_keyword || ""}
                          onChange={handleFormDataInputChange}
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
              </Card.Body>
            </Card>
          </Col>
          <Col xs={3}>
            <SEOAnalyser data={data}></SEOAnalyser>
          </Col>
        </Row>
      </Container>
    </>
  );
}
