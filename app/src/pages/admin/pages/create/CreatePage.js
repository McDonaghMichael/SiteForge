import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import {
  Card,
  Col,
  Row,
} from "react-bootstrap";
import AlertsComponent from "../../components/informative/AlertsComponent";
import SEOAnalyser from "../../components/seo/SEOAnalyser";
import ModalsComponent from "../../components/informative/ModalsComponent";
import ContentForm from "../../components/content/ContentForm";


export default function CreatePage() {
  // Data related to the contents of the page such as title, meta-data, etc
  const [data, setData] = useState([]);

  // Page content is whatever is inside the ContentEditor
  const [pageContent, setPageContent] = useState([{html: ""}]);

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
                <ContentForm data={data} pageContent={pageContent} submissionHandler={formSubmissionHandler} setPageContent={setPageContent} setData={setData}  />
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
