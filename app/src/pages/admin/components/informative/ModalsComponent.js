import Modal from 'react-bootstrap/Modal';
import {useEffect, useState} from 'react';
import Button from "react-bootstrap/Button";
import {Link} from "react-router-dom";

export default function ModalsComponent({enabled, title, body, link}) {

    const [displayModal, setDisplayModal] = useState(enabled);

    const handleClose = () => setDisplayModal(false);

    useEffect(() => {
        setDisplayModal(enabled);
    }, [enabled]);


    return (
        <>
            <Modal show={displayModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{body}</Modal.Body>
                <Modal.Footer>
                    {link && (
                        <Link to={`${link}`} target="_blank"><Button variant="primary" onClick={handleClose}>View Content</Button></Link>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    )
}