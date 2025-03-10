import React, {useCallback, useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState, convertToRaw, convertFromHTML} from 'draft-js';
import 'draft-js/dist/Draft.css';
import RichUtils from "draft-js/lib/RichTextEditorUtil";
import { stateToHTML } from "draft-js-export-html";
import ContentState from "draft-js/lib/ContentState";

// CREDITS: https://draftjs.org/docs/getting-started
export default function ContentEditor({form, onChange, html}) {

    const [editorState, setEditorState] = useState(() => {

        if (html) {
            const blocksFromHTML = convertFromHTML(html);
            const contentState = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap
            );
            return EditorState.createWithContent(contentState);
        }
        return EditorState.createEmpty();
    });


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

    const onH1Click = (e) => {
        e.preventDefault();
        setEditorState(RichUtils.toggleBlockType(editorState, "header-one"));
    };

    const onH2Click = (e) => {
        e.preventDefault();
        setEditorState(RichUtils.toggleBlockType(editorState, "header-two"));
    };

    const onH3Click = (e) => {
        e.preventDefault();
        setEditorState(RichUtils.toggleBlockType(editorState, "header-three"));
    };

    const onH4Click = (e) => {
        e.preventDefault();
        setEditorState(RichUtils.toggleBlockType(editorState, "header-four"));
    };

    const onH5Click = (e) => {
        e.preventDefault();
        setEditorState(RichUtils.toggleBlockType(editorState, "header-five"));
    };

    const onUnorderedListClick = (e) => {
        e.preventDefault();
        setEditorState(RichUtils.toggleBlockType(editorState, "unordered-list-item"));
    };

    const onOrderedListClick = (e) => {
        e.preventDefault();
        setEditorState(RichUtils.toggleBlockType(editorState, "ordered-list-item"));
    };

    const onMonospaceClick = (e) => {
        e.preventDefault();
        setEditorState(RichUtils.toggleInlineStyle(editorState, "CODE"));
    };

    const onCodeBlockClick = (e) => {
        e.preventDefault();
        setEditorState(RichUtils.toggleBlockType(editorState, "code-block"));
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
            <button onClick={onOrderedListClick} className="btn btn-primary me-3 mb-1">Ordered List</button>
            <button onClick={onUnorderedListClick} className="btn btn-primary me-3 mb-1">Unordered List</button>
            <button onClick={onMonospaceClick} className="btn btn-primary me-3 mb-1">Monospace</button>
            <button onClick={onCodeBlockClick} className="btn btn-primary me-3 mb-1">Code Block</button>
            <button onClick={onH1Click} className="btn btn-primary me-3 mb-1">H1</button>
            <button onClick={onH2Click} className="btn btn-primary me-3 mb-1">H2</button>
            <button onClick={onH3Click} className="btn btn-primary me-3 mb-1">H3</button>
            <button onClick={onH4Click} className="btn btn-primary me-3 mb-1">H4</button>
            <button onClick={onH5Click} className="btn btn-primary me-3 mb-1">H5</button>
            <div style={{border: "1px solid #ccc", padding: "10px", minHeight: "150px"}}>
                <Editor
                    editorState={editorState}
                    onChange={setEditorState}
                />

            </div>
        </div>
    );
}