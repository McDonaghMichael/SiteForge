import SEOAnalyserData, {getSEOScore} from "./SEOAnalyserData";
import {Card, CardBody, CardFooter, CardHeader, CardText} from "react-bootstrap";
import {useEffect, useState} from "react";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function SEOAnalyser({data}) {

    const [seoSCORE, setSeoSCORE] = useState(null);

    useEffect(() => {
        setSeoSCORE(getSEOScore(data));

        console.log(data.word_count);
    })

    return (
        <>
            <Card>
                <CardHeader>SEO Analyser</CardHeader>
                <CardBody>
                    <div style={{width: 250, height: 250}}>
                        <CircularProgressbar value={seoSCORE} text={`${seoSCORE}%`}/>
                    </div>
                    <br/>
                    <SEOAnalyserData
                        title={data.title}
                        word_count={data.word_count}
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