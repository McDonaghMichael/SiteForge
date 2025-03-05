import {useState} from "react";
import OpenAI from "openai";
import showdown from "showdown";
import Button from "react-bootstrap/Button";
import {Alert, Spinner} from "react-bootstrap";

export default function AIAnalyser({data}) {

    const [aiResponse, setAiResponse] = useState(null);

    const [hideResponse, setHideResponse] = useState(false);

    const [artificialIntelligenceLoading, setArtificialIntelligenceLoading] = useState(false);

    const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: 'sk-9e4ad911eab64053be7d127619320de7',
        dangerouslyAllowBrowser: true
    });

    const aiButton = async () => {

        setArtificialIntelligenceLoading(true);
        const completion = await openai.chat.completions.create({
            messages: [{role: "system", content: "Based on the page content below, can you analyse it and give a detailed response on how to improve it for better SEP, Readability and other key metrics, return as normal text as well no html. Avoid talking about HTML tags or code as this is directed towards a non technical user and should be on their level of understanding: " + data.html}],
            model: "deepseek-chat",
        });

        const converter = new showdown.Converter();
        const text      = completion.choices[0].message.content;


        setAiResponse(converter.makeHtml(text))
        setArtificialIntelligenceLoading(false);
        console.log(converter.makeHtml(text));
    }

    return (
        <>
            {!artificialIntelligenceLoading ? (
                <>
                    <Button
                        variant="info"
                        onClick={aiButton}
                        disabled={artificialIntelligenceLoading}
                    >
                        Ask AI!
                    </Button>
                    {aiResponse && (
                        <>
                            {!hideResponse ? (
                                <Button
                                    variant="warning"
                                    onClick={() => setHideResponse(true)}
                                    disabled={!aiResponse}
                                >
                                    Show Response
                                </Button>
                            ) : (
                                <Button
                                    variant="warning"
                                    onClick={() => setHideResponse(false)}
                                    disabled={!aiResponse}
                                >
                                    Hide Response
                                </Button>
                            )}
                            <br />
                            <br />
                            {!hideResponse && (
                                <Alert key={"info"} variant={"info"}>
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
                <Spinner animation="border" variant="info" />
            )}
        </>
    )
}