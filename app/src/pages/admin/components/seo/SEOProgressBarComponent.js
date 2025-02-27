import {Alert, ProgressBar} from "react-bootstrap";

const TITLE_LENGTH_DANGER = 60;
const TITLE_LENGTH_WARNING = 30;

const SLUG_LENGTH_DANGER = 20;
const SLUG_LENGTH_WARNING = 15;

const META_TITLE_LENGTH_DANGER = 60;
const META_TITLE_LENGTH_WARNING = 30;

const META_DESCRIPTION_LENGTH_DANGER = 60;
const META_DESCRIPTION_LENGTH_WARNING = 30;

const META_KEYWORDS_COUNT_DANGER = 100;
const META_KEYWORDS_COUNT_WARNING = 80;

export default function SeoProgressBarComponent({title, slug, meta_title, meta_keywords, meta_description}) {
    return (
        <>
            {title && title.length <= TITLE_LENGTH_WARNING &&(
                <>
                    <ProgressBar variant="info" now={(title.length / TITLE_LENGTH_WARNING) * 100}/>
                </>
            )}
            {title && title.length > TITLE_LENGTH_WARNING && title.length < TITLE_LENGTH_DANGER && (
                <>
                    <ProgressBar variant="warning" now={(title.length / TITLE_LENGTH_DANGER) * 100}/>
                    <br/>
                    <Alert key="warning" variant="warning">According to best SEO practices we recommend keeping your character limited between {TITLE_LENGTH_WARNING}-{TITLE_LENGTH_DANGER} at a maximum</Alert>
                </>
            )}
            {title && title.length >= TITLE_LENGTH_DANGER && (
                <>
                    <ProgressBar variant="danger" now={(title.length / TITLE_LENGTH_WARNING) * 100}/>
                    <br/>
                    <Alert key="danger" variant="danger">Avoid going above {TITLE_LENGTH_DANGER} characters as it could make the title hidden to some searchers</Alert>
                </>
            )}
            
            {slug && slug.length <= SLUG_LENGTH_WARNING &&(
                <>
                    <ProgressBar variant="info" now={(slug.length / SLUG_LENGTH_WARNING) * 100}/>
                </>
            )}
            {slug && slug.length > SLUG_LENGTH_WARNING && slug.length < SLUG_LENGTH_DANGER && (
                <>
                    <ProgressBar variant="warning" now={(slug.length / SLUG_LENGTH_WARNING) * 100}/>
                    <br/>
                    <Alert key="warning" variant="warning">Best SEO Practices recommend keeping your slug between 10-{SLUG_LENGTH_WARNING} characters</Alert>
                </>
            )}
            {slug && slug.length >= SLUG_LENGTH_DANGER && (
                <>
                    <ProgressBar variant="danger" now={(slug.length / SLUG_LENGTH_WARNING) * 100}/>
                    <br/>
                    <Alert key="danger" variant="danger">It is not recommended to go above {SLUG_LENGTH_DANGER} characters as it could hinder appearing in results</Alert>
                </>
            )}

            {meta_title && meta_title.length <= META_TITLE_LENGTH_WARNING &&(
                <>
                    <ProgressBar variant="info" now={(meta_title.length / META_TITLE_LENGTH_WARNING) * 100}/>
                </>
            )}
            {meta_title && meta_title.length > META_TITLE_LENGTH_WARNING && meta_title.length < META_TITLE_LENGTH_DANGER && (
                <>
                    <ProgressBar variant="warning" now={(meta_title.length / META_TITLE_LENGTH_WARNING) * 100}/>
                    <br/>
                    <Alert key="warning" variant="warning">According to best SEO practices we recommend keeping your character limited between {META_TITLE_LENGTH_WARNING}-{META_TITLE_LENGTH_DANGER} at a maximum</Alert>
                </>
            )}
            {meta_title && meta_title.length >= META_TITLE_LENGTH_DANGER && (
                <>
                    <ProgressBar variant="danger" now={(meta_title.length / META_TITLE_LENGTH_WARNING) * 100}/>
                    <br/>
                    <Alert key="danger" variant="danger">Avoid going above {META_TITLE_LENGTH_DANGER} characters as it could make the meta_title hidden to some searchers</Alert>
                </>
            )}

            {meta_keywords && meta_keywords.split(",").map(word => word.trim()).length <= META_KEYWORDS_COUNT_WARNING &&(
                <>
                    <ProgressBar variant="info" now={(meta_keywords.split(",").map(word => word.trim()).length / META_KEYWORDS_COUNT_WARNING) * 100}/>
                </>
            )}
            {meta_keywords && meta_keywords.split(",").map(word => word.trim()).length > META_KEYWORDS_COUNT_WARNING && meta_keywords.split(",").map(word => word.trim()).length < META_KEYWORDS_COUNT_DANGER && (
                <>
                    <ProgressBar variant="warning" now={(meta_keywords.split(",").map(word => word.trim()).length / META_KEYWORDS_COUNT_WARNING) * 100}/>
                    <br/>
                    <Alert key="warning" variant="warning">We recommend having between {META_KEYWORDS_COUNT_WARNING}-{META_KEYWORDS_COUNT_DANGER} keywords at maximum</Alert>
                </>
            )}
            {meta_keywords && meta_keywords.split(",").map(word => word.trim()).length >= META_KEYWORDS_COUNT_DANGER && (
                <>
                    <ProgressBar variant="danger" now={(meta_keywords.split(",").map(word => word.trim()).length / META_KEYWORDS_COUNT_WARNING) * 100}/>
                    <br/>
                    <Alert key="danger" variant="danger">Google no longer focuses on meta keywords a lot for SEO so avoid having more than {META_KEYWORDS_COUNT_DANGER}</Alert>
                </>
            )}

            {meta_description && meta_description.length <= META_KEYWORDS_COUNT_WARNING &&(
                <>
                    <ProgressBar variant="info" now={(meta_description.length / META_KEYWORDS_COUNT_WARNING) * 100}/>
                </>
            )}
            {meta_description && meta_description.length > META_KEYWORDS_COUNT_WARNING && meta_description.length < META_KEYWORDS_COUNT_DANGER && (
                <>
                    <ProgressBar variant="warning" now={(meta_description.length / META_KEYWORDS_COUNT_WARNING) * 100}/>
                    <br/>
                    <Alert key="warning" variant="warning">Having the meta description between {META_KEYWORDS_COUNT_WARNING}-{META_KEYWORDS_COUNT_DANGER} characters helps with SEO according to best practices</Alert>
                </>
            )}
            {meta_description && meta_description.length >= META_KEYWORDS_COUNT_DANGER && (
                <>
                    <ProgressBar variant="danger" now={(meta_description.length / META_KEYWORDS_COUNT_WARNING) * 100}/>
                    <br/>
                    <Alert key="danger" variant="danger">It can have a negative impact having a meta description above {META_KEYWORDS_COUNT_DANGER} characters as it wont be visible to some viewers</Alert>
                </>
            )}
        </>
    )
}