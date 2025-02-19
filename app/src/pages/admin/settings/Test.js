import Sidebar from "../components/sidebar/Sidebar";
import {DndContext} from "react-dnd";
import Droppable from "./Droppable";
import {useState} from "react";
import Draggable from "./Draggable";


export default function Test(){
    {
        const [isDropped, setIsDropped] = useState(false);
        const draggableMarkup = (
            <Draggable>Drag mfe</Draggable>
        );

        return (
            <DndContext onDragEnd={handleDragEnd}>
                {!isDropped ? draggableMarkup : null}

                <br/>
                <br/>
                <br/>
                <br/>
                <Droppable>
                    {isDropped ? draggableMarkup : 'Drop here'}
                </Droppable>
            </DndContext>
        );

        function handleDragEnd(event) {
            if (event.over && event.over.id === 'droppable') {
                setIsDropped(true);
            }
        }
    }}