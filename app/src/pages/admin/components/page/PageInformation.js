import {Card, CardBody, CardHeader, Col, Row} from "react-bootstrap";
import SEOAnalyserData from "../seo/SEOAnalyserData";
import {Link} from "react-router-dom";

export default function PageInformation({data}) {
    return (
        <>
            <Card>
                <CardHeader>Page Information</CardHeader>
                <CardBody>
                    <Row>
                        <Col>
                            <strong>Author</strong>
                        </Col>
                        <Col>
                            <hspan>Me</hspan>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col>
                            <strong>Creation Date</strong>
                        </Col>
                        <Col>
                            <span>27/02/2025</span>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col>
                            <strong>View Page</strong>
                        </Col>
                        <Col>
                            <Link to={`/${data.slug}`}>Click here</Link>
                        </Col>
                    </Row>

                </CardBody>
            </Card>
        </>
    )
}