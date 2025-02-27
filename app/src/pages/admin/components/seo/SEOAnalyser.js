import SEOAnalyserData from "./SEOAnalyserData";
import {Card, CardBody, CardHeader} from "react-bootstrap";

export default function SEOAnalyser({data}) {
    return (
        <>
            <Card>
                <CardHeader>SEO Analyser</CardHeader>
                <CardBody>
                    <SEOAnalyserData title={data.title}></SEOAnalyserData>
                    <SEOAnalyserData slug={data.slug}></SEOAnalyserData>
                    <SEOAnalyserData meta_title={data.meta_title}></SEOAnalyserData>
                    <SEOAnalyserData meta_description={data.meta_description}></SEOAnalyserData>
                    <SEOAnalyserData meta_keywords={data.meta_keywords}></SEOAnalyserData>
                </CardBody>
            </Card>
        </>
    )
}