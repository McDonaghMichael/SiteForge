import {Card, CardBody, CardHeader, Col, Row} from "react-bootstrap";
import SEOAnalyserData from "../seo/SEOAnalyserData";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";

export default function ContentInformation({data, slug}) {
    return (
        <>
            <Card>
                <CardHeader>Content Information</CardHeader>
                <CardBody>
                    <Row>
                        <Col>
                            <strong>Author</strong>
                        </Col>
                        <Col>
                            <hspan>{data.author}</hspan>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <strong>Creation Date</strong>
                        </Col>
                        <Col>
                            <span>{data.created_date}</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <strong>Last Updated</strong>
                        </Col>
                        <Col>
                            <span>{data.updated_date}</span>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col>
                            <Link to={`${slug}`} target="_blank"><Button variant="primary" >View Content</Button></Link>
                        </Col>
                    </Row>

                </CardBody>
            </Card>
        </>
    )
}