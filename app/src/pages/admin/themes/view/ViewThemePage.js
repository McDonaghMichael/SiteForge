import {useEffect, useState} from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import {Link, useParams} from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Container from "react-bootstrap/Container";
import {Card, CardTitle, Col, Row} from "react-bootstrap";
import ThemePreview from "../../components/themes/ThemePreview";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faYoutube,
    faFacebook,
    faTwitter,
    faInstagram, faTiktok, faLinkedin, faGithub
} from "@fortawesome/free-brands-svg-icons";

export default function ViewThemePage () {

    const [theme, setTheme] = useState([]);

    const { id } = useParams();

    useEffect(() => {
        axios.get("http://localhost:8080/themes")
            .then(res => {
                setTheme(res.data[id]);
            })
            .catch(error => {
                console.error("Error fetching theme:", error);
            });
    }, []);

    useEffect(() => {
        console.log("Theme updated:", theme);
    }, [theme]);


    return (
        <>
            <Sidebar title={"View Theme"}/>
            <Container>
                <Row>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            {theme.author && (
                                <th>Author</th>
                            )}
                            <th>Description</th>
                            {theme.website && (
                                <th>Website</th>
                            )}
                            {theme.github && (
                                <th>Github</th>
                            )}
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{theme.name}</td>
                            {theme.author && (
                                <td>{theme.author}</td>
                            )}
                            <td>{theme.description}</td>
                            {theme.website && (
                                <td><a href={theme.website} target="_blank">{theme.website.replace("https://", "")}</a> </td>
                            )}
                            {theme.github && (
                                <td><a href={theme.github} target="_blank">{theme.github.replace("https://github.com/", "")}</a> </td>
                            )}
                        </tr>
                        </tbody>
                    </table>
                        <Container>
                            <Row>
                                <Col>
                                    {theme.FacebookProfile && (
                                        <FontAwesomeIcon icon={faFacebook} size="2x" />
                                    )}
                                </Col>

                                <Col>
                                    {theme.TikTokProfile && (
                                        <FontAwesomeIcon icon={faTiktok} size="2x" />
                                    )}
                                </Col>
                                <Col>
                                    {theme.InstagramProfile && (
                                        <FontAwesomeIcon icon={faInstagram} size="2x" />
                                    )}
                                </Col>
                                <Col>
                                    {theme.GithubProfile && (
                                        <FontAwesomeIcon icon={faGithub} size="2x" />
                                    )}
                                </Col>
                                <Col>
                                    {theme.LinkedInProfile && (
                                        <FontAwesomeIcon icon={faLinkedin} size="2x" />
                                    )}
                                </Col>

                            </Row>
                            <Row>
                                <Card>
                                    <Card.Header>Header</Card.Header>
                                    <Card.Body>
                                        <ThemePreview css={theme.css} html={theme.navbar} />
                                    </Card.Body>
                                </Card>
                            </Row>
                            <br/>
                            <Row>
                                <Card>
                                    <Card.Header>Footer</Card.Header>
                                    <Card.Body>
                                        <ThemePreview css={theme.css} html={theme.footer} />
                                    </Card.Body>
                                </Card>
                            </Row>
                            <br/>
                            <Row>
                                <Card>
                                    <Card.Header>CSS</Card.Header>
                                    <Card.Body>
                                        <code>{theme.css}</code>
                                    </Card.Body>
                                </Card>
                            </Row>
                        </Container>

                </Row>
            </Container>
        </>
    )
}