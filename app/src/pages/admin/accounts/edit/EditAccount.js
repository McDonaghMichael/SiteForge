import Container from "react-bootstrap/Container";
import {Col, Row} from "react-bootstrap";
import Sidebar from "../../components/sidebar/Sidebar";

export default function EditAccount() {
    return (
        <>
            <Sidebar title={"Edit Account"}/>
            <Container>
                <Row>
                    <Container>
                        <Row>
                            <Col>1 of 2</Col>
                            <Col>2 of 2</Col>
                        </Row>
                    </Container>
                </Row>
            </Container>
        </>
    )
}