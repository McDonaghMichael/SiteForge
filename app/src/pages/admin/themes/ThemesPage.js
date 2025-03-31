import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import { Alert, Badge, Card, Col, Row, Spinner } from "react-bootstrap";
import Container from "react-bootstrap/Container";

export default function ThemesPage() {
    const [themes, setThemes] = useState([]);
    const [currentTheme, setCurrentTheme] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [themesResponse, currentThemeResponse] = await Promise.all([
                    axios.get("http://localhost:8080/themes"),
                    axios.get("http://localhost:8080/theme")
                ]);

                setThemes(themesResponse.data);
                setCurrentTheme(currentThemeResponse.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load themes. Please try again later.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <>
                <Sidebar title="Themes" />
                <Container className="mt-5 text-center">
                    <Spinner animation="border" role="status" variant="primary">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <p className="mt-3">Loading themes...</p>
                </Container>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Sidebar title="Themes" />
                <Container className="mt-5">
                    <Alert variant="danger">{error}</Alert>
                </Container>
            </>
        );
    }

    return (
        <>
            <Sidebar title="Themes" />
            <Container className="py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">Available Themes</h2>
                    <Link to="/admin/theme/import" className="btn btn-success">
                        <i className="bi bi-plus-circle me-2"></i>Add New Theme
                    </Link>
                </div>

                <Row xs={1} md={2} lg={3} className="g-4">
                    {themes.map((item, index) => (
                        <Col key={item.id || index}>
                            <Card className="h-100 shadow-sm hover-shadow">
                                {item.featured_image && (
                                    <Card.Img
                                        variant="top"
                                        src={item.featured_image}
                                        alt={`${item.name} theme preview`}
                                        className="img-fluid"
                                        style={{ height: "180px", objectFit: "cover" }}
                                    />
                                )}
                                <Card.Body className="d-flex flex-column">
                                    <div className="mb-auto">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <Card.Title className="mb-0">{item.name}</Card.Title>
                                            {currentTheme._id === item.id && (
                                                <Badge bg="success" pill>Active</Badge>
                                            )}
                                        </div>
                                        <Card.Text className="text-muted">
                                            {item.description}
                                        </Card.Text>
                                    </div>
                                    <div className="d-flex justify-content-between mt-3">
                                        <Link to={`/admin/theme/view/${index}`} className="btn btn-primary">
                                            <i className="bi bi-eye me-1"></i> View
                                        </Link>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {themes.length === 0 && !loading && (
                    <Alert variant="info" className="text-center">
                        No themes available. Add a new theme to get started.
                    </Alert>
                )}
            </Container>
        </>
    );
}