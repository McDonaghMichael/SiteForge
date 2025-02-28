import React, {useCallback, useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState, convertToRaw, convertFromHTML} from 'draft-js';
import 'draft-js/dist/Draft.css';
import RichUtils from "draft-js/lib/RichTextEditorUtil";
import { stateToHTML } from "draft-js-export-html";
import ContentState from "draft-js/lib/ContentState";

// CREDITS: https://draftjs.org/docs/getting-started
export default function ContentEditor({form, onChange, html}) {

    const prevContentRef = useRef("");

    useEffect(() => {
        if (html) {
            const blocksFromHTML = convertFromHTML(html);
            const contentState = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap
            );
            setEditorState(EditorState.createWithContent(contentState));
        }
    }, [html]);

    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );

    const onBoldClick = (e) => {
        e.preventDefault();
        setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
    };

    const onUnderlineClick = (e) => {
        e.preventDefault();
        setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
    };

    const onItalicClick = (e) => {
        e.preventDefault();
        setEditorState(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
    };

    useEffect(() => {
        const contentHtml = stateToHTML(editorState.getCurrentContent());

        // CREDITS: https://www.geeksforgeeks.org/how-to-strip-out-html-tags-from-a-string-using-javascript/
        const parser = new DOMParser();
        const doc = parser.parseFromString(contentHtml, 'text/html');
        const textContent = doc.body.textContent || "";
        textContent.trim();

        onChange({html: contentHtml, text: textContent});

        console.log(textContent);
    }, [editorState]);


    return (
        <div>
            <button onClick={onBoldClick} className="btn btn-primary me-3 mb-1">Bold</button>
            <button onClick={onUnderlineClick} className="btn btn-primary me-3 mb-1">Underline</button>
            <button onClick={onItalicClick} className="btn btn-primary me-3 mb-1">Italic</button>
            <div style={{border: "1px solid #ccc", padding: "10px", minHeight: "150px"}}>
                <Editor editorState={editorState} onChange={setEditorState} />
            </div>
        </div>
    );
}