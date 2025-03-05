import {Alert, ProgressBar} from "react-bootstrap";
import {useEffect, useState} from "react";

const TITLE_LENGTH_DANGER = 60;
const TITLE_LENGTH_WARNING = 30;

const WORD_COUNT_LENGTH_DANGER = 350;
const WORD_COUNT_LENGTH_WARNING = 450;

const SLUG_LENGTH_DANGER = 20;
const SLUG_LENGTH_WARNING = 15;

const META_TITLE_LENGTH_DANGER = 60;
const META_TITLE_LENGTH_WARNING = 30;

const META_DESCRIPTION_LENGTH_DANGER = 60;
const META_DESCRIPTION_LENGTH_WARNING = 30;

const META_KEYWORDS_COUNT_DANGER = 100;

const META_KEYWORDS_COUNT_WARNING = 80;

const FOCUS_KEYWORD_COUNT_DANGER = 11;
const FOCUS_KEYWORD_COUNT_WARNING = 7;

export function getFocusKeywordCountWarning(){
    return FOCUS_KEYWORD_COUNT_WARNING;
}

export default function SEOAnalyserData({title, slug, content, meta_title, meta_keywords, meta_description, word_count, focus_keyword}) {

    const [focusKeywordCount, setFocusKeywordCount] = useState(0);


    useEffect(() => {
        if (content) {
            setFocusKeywordCount((content.match(new RegExp(focus_keyword, "g")) || []).length);
        }
    }, [content, focus_keyword]);


    return (
        <>
            {title == undefined && (
                <>
                    <Alert key="warning" variant="warning"><strong>Title:</strong> Avoid leaving the title blank</Alert>
                </>
            )}

            {title && title.length > TITLE_LENGTH_WARNING && title.length < TITLE_LENGTH_DANGER && (
                <>
                    <Alert key="warning" variant="warning"><strong>Title:</strong> According to best SEO practices we recommend keeping your character limited between {TITLE_LENGTH_WARNING}-{TITLE_LENGTH_DANGER} at a maximum</Alert>
                </>
            )}
            {title && title.length >= TITLE_LENGTH_DANGER && (
                <>
                    <Alert key="danger" variant="danger"><strong>Title:</strong> Avoid going above {TITLE_LENGTH_DANGER} characters as it could make the title hidden to some searchers</Alert>
                </>
            )}

            {word_count <= 1 && (
                <>
                    <Alert key="warning" variant="warning"><strong>Word Count:</strong> The content cannot be empty</Alert>
                </>
            )}
            {word_count < WORD_COUNT_LENGTH_DANGER && (
                <>
                    <Alert key="danger" variant="danger"><strong>Word Count:</strong> Avoid having less than {WORD_COUNT_LENGTH_DANGER} words in your content as having more plentiful content can boost SEO</Alert>
                </>
            )}
            {word_count > WORD_COUNT_LENGTH_DANGER && word_count < WORD_COUNT_LENGTH_WARNING && (
                <>
                    <Alert key="warning" variant="warning"><strong>Word Count:</strong> Content with between {WORD_COUNT_LENGTH_DANGER}-{WORD_COUNT_LENGTH_WARNING} words helps with SEO according to best practices</Alert>
                </>
            )}

            {focus_keyword == undefined && (
                <>
                    <Alert key="warning" variant="warning"><strong>Focus Keyword:</strong> The Focus Keyword cannot be left empty</Alert>
                </>
            )}
            {focus_keyword && content && focusKeywordCount > FOCUS_KEYWORD_COUNT_WARNING && focusKeywordCount < FOCUS_KEYWORD_COUNT_DANGER && (
                <>
                    <Alert key="warning" variant="warning"><strong>Focus Keyword:</strong> Best SEO Practices recommend keeping your focus keyword between {FOCUS_KEYWORD_COUNT_WARNING}-{FOCUS_KEYWORD_COUNT_DANGER} entries into your content</Alert>
                </>
            )}
            {focus_keyword && content && focusKeywordCount >= FOCUS_KEYWORD_COUNT_DANGER && (
                <>
                    <Alert key="danger" variant="danger"><strong>Focus Keyword:</strong> It is not recommended to go above {FOCUS_KEYWORD_COUNT_DANGER} keyword entries as it could hinder appearing in results</Alert>
                </>
            )}


            {slug == undefined && (
                <>
                    <Alert key="warning" variant="warning"><strong>Slug:</strong> The slug cannot be left empty</Alert>
                </>
            )}
            {slug && slug.length > SLUG_LENGTH_WARNING && slug.length < SLUG_LENGTH_DANGER && (
                <>
                    <Alert key="warning" variant="warning"><strong>Slug:</strong> Best SEO Practices recommend keeping your slug between 10-{SLUG_LENGTH_WARNING} characters</Alert>
                </>
            )}
            {slug && slug.length >= SLUG_LENGTH_DANGER && (
                <>
                    <Alert key="danger" variant="danger"><strong>Slug:</strong> It is not recommended to go above {SLUG_LENGTH_DANGER} characters as it could hinder appearing in results</Alert>
                </>
            )}

            {meta_title == undefined && (
                <>
                    <Alert key="warning" variant="warning"><strong>Meta Title:</strong> Meta Title must not be blank</Alert>
                </>
            )}
            {meta_title && meta_title.length > META_TITLE_LENGTH_WARNING && meta_title.length < META_TITLE_LENGTH_DANGER && (
                <>
                    <Alert key="warning" variant="warning"><strong>Meta Title:</strong> According to best SEO practices we recommend keeping your character limited between {META_TITLE_LENGTH_WARNING}-{META_TITLE_LENGTH_DANGER} at a maximum</Alert>
                </>
            )}
            {meta_title && meta_title.length >= META_TITLE_LENGTH_DANGER && (
                <>
                    <Alert key="danger" variant="danger"><strong>Meta Title:</strong> Avoid going
                        above {META_TITLE_LENGTH_DANGER} characters as it could make the meta_title hidden to some searchers</Alert>
                </>
            )}

            {meta_description == undefined && (
                <>
                    <Alert key="warning" variant="warning"><strong>Meta Description:</strong> The Meta Description cannot be empty</Alert>
                </>
            )}
            {meta_description && meta_description.length > META_DESCRIPTION_LENGTH_WARNING && meta_description.length < META_DESCRIPTION_LENGTH_DANGER && (
                <>
                    <Alert key="warning" variant="warning"><strong>Meta Description:</strong> Having the meta description between {META_DESCRIPTION_LENGTH_WARNING}-{META_DESCRIPTION_LENGTH_DANGER} characters helps with SEO according to best practices</Alert>
                </>
            )}
            {meta_description && meta_description.length >= META_DESCRIPTION_LENGTH_DANGER && (
                <>
                    <Alert key="danger" variant="danger"><strong>Meta Description:</strong> It can have a negative
                        impact having a meta description above {META_DESCRIPTION_LENGTH_DANGER} characters as it wont be visible to some viewers</Alert>
                </>
            )}

            {meta_keywords == undefined && (
                <>
                    <Alert key="warning" variant="warning"><strong>Meta Keywords:</strong> Provide atleast one meta keyword</Alert>
                </>
            )}
            {meta_keywords && meta_keywords.split(",").map(word => word.trim()).length > META_KEYWORDS_COUNT_WARNING && meta_keywords.split(",").map(word => word.trim()).length < META_KEYWORDS_COUNT_DANGER && (
                <>
                    <Alert key="warning" variant="warning"><strong>Meta Keywords:</strong> We recommend having between {META_KEYWORDS_COUNT_WARNING}-{META_KEYWORDS_COUNT_DANGER} keywords at maximum</Alert>
                </>
            )}
            {meta_keywords && meta_keywords.split(",").map(word => word.trim()).length >= META_KEYWORDS_COUNT_DANGER && (
                <>
                    <Alert key="danger" variant="danger"><strong>Meta Keywords:</strong> Google no longer focuses on meta keywords a lot for SEO so avoid having more than {META_KEYWORDS_COUNT_DANGER}</Alert>
                </>
            )}

        </>
    )
}

export function getSEOScore(page){

    const SEO_SCORING_OPTIONS = 7;
    const PERFECT_SCORE = Math.round(100 / SEO_SCORING_OPTIONS);
    const NEAR_PERFECT_SCORE = Math.floor(PERFECT_SCORE * 0.6);
    
    let score = 0;
    if(page.title && page.title.length < TITLE_LENGTH_WARNING){
        score += PERFECT_SCORE;
    }else if(page.title && page.title.length > TITLE_LENGTH_WARNING && page.title.length < TITLE_LENGTH_DANGER){
        score += NEAR_PERFECT_SCORE;
    }

    if(page.slug && page.slug.length < SLUG_LENGTH_WARNING){
        score += PERFECT_SCORE;
    }else if(page.slug && page.slug.length > SLUG_LENGTH_DANGER && page.slug.length < SLUG_LENGTH_DANGER){
        score += NEAR_PERFECT_SCORE;
    }

    if(page.meta_title && page.meta_title.length < META_TITLE_LENGTH_WARNING){
        score += PERFECT_SCORE;
    }else if(page.meta_title && page.meta_title.length > META_TITLE_LENGTH_DANGER && page.meta_title.length < META_TITLE_LENGTH_DANGER){
        score += NEAR_PERFECT_SCORE;
    }

    if(page.meta_description && page.meta_description.length < META_DESCRIPTION_LENGTH_WARNING){
        score += PERFECT_SCORE;
    }else if(page.meta_description && page.meta_description.length > META_DESCRIPTION_LENGTH_DANGER && page.meta_description.length < META_DESCRIPTION_LENGTH_DANGER){
        score += NEAR_PERFECT_SCORE;
    }

    if(page.meta_keywords && page.meta_keywords.split(",").map(word => word.trim()).length < META_KEYWORDS_COUNT_WARNING){
        score += PERFECT_SCORE;
    }else if(page.meta_keywords && page.meta_keywords.split(",").map(word => word.trim()).length > META_KEYWORDS_COUNT_DANGER && page.meta_keywords.split(",").map(word => word.trim()).length < META_KEYWORDS_COUNT_DANGER){
        score += NEAR_PERFECT_SCORE;
    }

    if(page.word_count < WORD_COUNT_LENGTH_DANGER){
        score += NEAR_PERFECT_SCORE;
    }else if(page.word_count > WORD_COUNT_LENGTH_DANGER && page.word_count < WORD_COUNT_LENGTH_WARNING){
        score += PERFECT_SCORE;
    }

    if(page.word_count < WORD_COUNT_LENGTH_DANGER){
        score += NEAR_PERFECT_SCORE;
    }else if(page.word_count > WORD_COUNT_LENGTH_DANGER && page.word_count < WORD_COUNT_LENGTH_WARNING){
        score += PERFECT_SCORE;
    }

    return score;
}