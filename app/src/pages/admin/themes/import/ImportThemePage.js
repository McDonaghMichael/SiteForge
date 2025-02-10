import {useEffect, useState} from "react";
import axios from "axios";

export default function ImportThemePage (){
    const [jsonData, setJsonData] = useState(null);

    const handleFileUpload = (event) => {
        const file = event.target.files[0]; // Get the selected file
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsedData = JSON.parse(e.target.result);
                setJsonData(parsedData);
                console.log("Parsed JSON Data:", parsedData);
            } catch (error) {
                console.error("Invalid JSON file:", error);
                alert("Error: Invalid JSON file format!");
            }
        };
        reader.readAsText(file); // Read file content as text
    };

    const handleUpload = async () => {
        if (!jsonData) {
            alert("No JSON data to upload!");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/theme/import", jsonData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("Server Response:", response.data);
            alert("JSON uploaded successfully!");
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload JSON!");
        }
    };

    return (
        <div>
            <h2>Upload a JSON File</h2>
            <input type="file" accept=".json" onChange={handleFileUpload} />
            <button onClick={handleUpload} disabled={!jsonData}>Upload to Server</button>
        </div>
    )
}