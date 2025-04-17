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
import AlertsComponent from "../../components/informative/AlertsComponent";
import ContentInformation from "../../components/content/ContentInformation";
import ContentEditor from "../../components/content/ContentEditor";
import ModalsComponent from "../../components/informative/ModalsComponent";
import AIAnalyser from "../../components/ai/AIAnalyser";
import ContentForm from "../../components/content/ContentForm";

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
    const res = axios.get("https://siteforgeapi.mcdonagh.xyz/pages").then((res) => {
      setPage(res.data[id]);
      setData(res.data[id]);
      setOldData(res.data[id]);
    });
  }, []);

  const formSubmissionHandler = async (e) => {
    e.preventDefault();
    setPageEdited(false);
    setError(false);

    try {
      data.oldSlug = oldData.slug;
      data.type = parseInt(data.type);
      data.html = pageContent.html;
      data.updated_date = new Date().toLocaleDateString();

      console.log(data);
      const response = await axios.post(
        "https://siteforgeapi.mcdonagh.xyz/page/edit",
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
      setErrorMessage(error.response.data);
    }
  };


  return (
    <>
      <Sidebar title={"Edit Page"} />
      <Container>
        <Row>
          <ModalsComponent
            enabled={pageEdited}
            title={"Page Updated"}
            body={"Page has been successfully updated."}
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
              <Card.Header>Page Editor</Card.Header>
              <Card.Body>
                <ContentForm data={data} pageContent={pageContent} submissionHandler={formSubmissionHandler} setPageContent={setPageContent} setData={setData}  />
              </Card.Body>
            </Card>
          </Col>
          <Col xs={3}>
            <ContentInformation data={data} slug={`/${data.slug}`} />
            <br />
            <SEOAnalyser data={data} />
          </Col>
        </Row>
      </Container>
    </>
  );
}
