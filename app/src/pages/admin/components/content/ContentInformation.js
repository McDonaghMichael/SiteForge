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
                            {!data.updated_date && !data.author && !data.updated_date && (
                                <>
                                    <p>No data to display.</p>
                                </>
                            )}
                    </Row>
                    <Row>
                        {data.author && (
                            <>
                                <Col>
                                    <strong>Author</strong>
                                </Col>
                                <Col>
                                    <span>{data.author}</span>
                                </Col>
                            </>
                        )}
                    </Row>
                    <Row>
                        {data.created_date && (
                            <>
                                <Col>
                                    <strong>Creation Date</strong>
                                </Col>
                                <Col>
                                    <span>{data.created_date}</span>
                                </Col>
                            </>
                        )}
                    </Row>
                    <Row>
                        {data.updated_date && (
                            <>
                                <Col>
                                    <strong>Last Updated</strong>
                                </Col>
                                <Col>
                                    <span>{data.updated_date}</span>
                                </Col>
                            </>
                        )}
                    </Row>
                    <br/>
                    <Row>
                        {data.created_date && (
                            <>
                                <Col>
                                    <Link to={`${slug}`} target="_blank"><Button variant="primary" >View Content</Button></Link>
                                </Col>
                            </>
                        )}
                    </Row>


                </CardBody>
            </Card>
        </>
    )
}