import SEOAnalyserData from "./SEOAnalyserData";
import {Card, CardBody, CardHeader} from "react-bootstrap";

export default function SEOAnalyser({data}) {
    return (
        <>
            <Card>
                <CardHeader>SEO Analyser</CardHeader>
                <CardBody>
                    <SEOAnalyserData
                        title={data.title}
                        slug={data.slug}
                        meta_title={data.meta_title}
                        meta_description={data.meta_description}
                        meta_keywords={data.meta_keywords}
                    />
                </CardBody>
            </Card>
        </>
    )
}