import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useState} from "react";
import axios from "axios";

export default function DeleteModal({show, onClose, handleClose, account, fetchData}) {

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleDelete = async () => {
        setError(false);
        try {
            const response = await axios.post("http://localhost:8080/account/delete", account, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            fetchData();
            handleClose();
        } catch (error) {
            setError(true);
            setErrorMessage(error.response.data);
        }
    }
    return (
        <>
            <div
                className="modal show"
                style={{ display: 'block', position: 'initial' }}
            >
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Account Deletion</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you would like to delete this account? It cannot be undone.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            <strong>DELETE</strong>
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}