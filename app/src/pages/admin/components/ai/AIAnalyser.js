import {useState} from "react";
import OpenAI from "openai";
import showdown from "showdown";
import Button from "react-bootstrap/Button";
import {Alert, Spinner} from "react-bootstrap";

export default function AIAnalyser({data}) {

    const [aiResponse, setAiResponse] = useState(null);
    const [hideResponse, setHideResponse] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Well, let's see what I can do!");
    const [error, setError ] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const loadingMessages = [
        "Thinking of what needs improvement...",
        "Wondering what the meaning of life is...",
        "HMMM... Interesting...",
        "This is taking longer than expected, bare with me!...",
    ]

    const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: 'sk-9e4ad911eab64053be7d127619320de7',
        dangerouslyAllowBrowser: true
    });

    const analyseData = async () => {

        setLoading(true);
        let messageIndex = 0;
        setInterval(function () {
                if(messageIndex >= loadingMessages.length){
                    return;
                }
                setLoadingMessage(loadingMessages[messageIndex]);
                messageIndex++;
            },
            5000);
        const completion = await openai.chat.completions.create({
            messages: [{role: "system", content: "Based on the page content below, can you analyse it and give a detailed response on how to improve it for better SEP, Readability and other key metrics, return as normal text as well no html. Avoid talking about HTML tags or code as this is directed towards a non technical user and should be on their level of understanding: " + data}],
            model: "deepseek-chat",
        });



        const converter = new showdown.Converter();
        const text      = completion.choices[0].message.content;
        
        setAiResponse(converter.makeHtml(text))
        setLoading(false);
        console.log(converter.makeHtml(text));
    }

    return (
        <>
            {!loading ? (
                <>
                    <Button
                        variant="purple"
                        onClick={analyseData}
                        disabled={loading}
                    >
                        Ask AI how to improve the content
                    </Button>
                    {aiResponse && (
                        <>
                            {!hideResponse ? (
                                <Button
                                    variant="magenta"
                                    onClick={() => setHideResponse(true)}
                                    disabled={!aiResponse}
                                    className="ms-4"
                                >
                                    Hide Response
                                </Button>
                            ) : (
                                <Button
                                    variant="magenta"
                                    onClick={() => setHideResponse(false)}
                                    disabled={!aiResponse}
                                    className="ms-4"
                                >
                                    Show Response
                                </Button>
                            )}
                            <br />
                            <br />
                            {!hideResponse && (
                                <Alert className="alert-purple">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: aiResponse,
                                        }}
                                    />
                                </Alert>
                            )}
                        </>
                    )}
                </>
            ) : (
                <>

                    <Alert className="alert-purple w-50">
                        {loadingMessage}
                    </Alert>
                    <br/>
                    <Spinner animation="border" className="purple"/></>
            )}
        </>
    )
}