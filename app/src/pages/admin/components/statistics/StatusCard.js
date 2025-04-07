import { Badge, Card } from "react-bootstrap";

export default function StatusCard({ title, value, variant }) {
    return (
        <Card>
            <Card.Body className="d-flex justify-content-between align-items-center">
                <span>{title}</span>
                <Badge bg={variant} style={{ fontSize: '1.2rem' }}>{value}</Badge>
            </Card.Body>
        </Card>
    );
}