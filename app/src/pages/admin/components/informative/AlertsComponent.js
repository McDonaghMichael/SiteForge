import {Alert} from "react-bootstrap";

export default function AlertsComponent({enabled, key, variant, message}){
    return (
        <>
            {enabled &&(
                <Alert key={key} variant={variant}>{message}</Alert>
            )}
        </>
    )
}