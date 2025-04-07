import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from "../components/sidebar/Sidebar";
import {Card, Col, Row} from "react-bootstrap";
import AlertsComponent from "../components/informative/AlertsComponent";
import Container from "react-bootstrap/Container";
import {useEffect, useState} from "react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import axios from "axios";
import Button from "react-bootstrap/Button";
import LoggerPage from "../logger/LoggerPage";
import LoggerPieChart from "../components/statistics/LoggerPieChart";

export default function Dashboard (){

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    ChartJS.register(ArcElement, Tooltip, Legend);

    const [pagination, setPagination] = useState(0);
    const [maxPagination, setMaxPagination] = useState(2);

    const nextPage = () => {
        let index = pagination + 1;
        setPagination(index);
    }
    const prevPage = () => {
        let index = pagination - 1;
        setPagination(index);
    }
    return (
        <>
            <Sidebar title={"Dashboard"}/>
            <Container>
                <Row>
                    <AlertsComponent
                        enabled={error}
                        key="danger"
                        variant="danger"
                        message={`An error has occurred, please try again. ${errorMessage}`}
                    ></AlertsComponent>
                    <Col>
                        <Card>
                            <Card.Header>Page Creation</Card.Header>
                            <Card.Body>hi</Card.Body>
                        </Card>
                    </Col>
                    <Col xs={3}>

                        <LoggerPieChart index={pagination}/>

                        {pagination > 0 && (
                            <Button onClick={prevPage}>Prev</Button>
                        )}
                        {pagination < maxPagination && (
                            <Button onClick={nextPage}>Next</Button>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    )
}