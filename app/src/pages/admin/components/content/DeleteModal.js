import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function DeleteModal({show, handleClose, title, body, confirmAction}) {
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleConfirm = async () => {
        setError(false);
        try {
            await confirmAction();
            handleClose();
        } catch (error) {
            setError(true);
            setErrorMessage(error.response?.data || "An error occurred");
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {body}
                {error && <div className="alert alert-danger mt-3">{errorMessage}</div>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                Close
                </Button>
                <Button variant="danger" onClick={handleConfirm}>
                    DELETE
                </Button>
            </Modal.Footer>
        </Modal>
    );
}