import {closestCorners, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {useEffect, useState} from "react";
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable";

import axios from "axios";
import Button from "react-bootstrap/Button";
import {NavbarItem} from "./NavbarItem";

export default function NavbarManager({onChange, items}) {
    const [navbarItems, setNavbarItems] = useState(items);

    const [pages, setPages] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/pages").then(res => {
            setPages(res.data);
        })
    }, []);


    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const addToList = (page) => {
        setNavbarItems((navbarItems) => [...navbarItems, { id: page._id, title: page.title, slug: page.slug }]);
        console.log(navbarItems)
    }

    const removeFromList = (id) => {

        setNavbarItems(navbarItems.filter(x => x.id !== id));
        console.log(navbarItems)
    };


    useEffect(() => {
        onChange(navbarItems)
    }, [navbarItems]);

    const getTaskPos = (id) => navbarItems.findIndex((task) => task.id === id);

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id === over.id) return;

        setNavbarItems((navbarItems) => {
            const originalPos = getTaskPos(active.id);
            const newPos = getTaskPos(over.id);

            return arrayMove(navbarItems, originalPos, newPos);
        });
    };

    return (
        <div className="App">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
            >
                <div className="column">
                    <SortableContext items={navbarItems} strategy={verticalListSortingStrategy}>
                        {navbarItems.map((item) => (
                            <>
                                <Button onClick={() => removeFromList(item.id)}>X</Button>
                                <NavbarItem key={item.id} id={item.id} title={item.title}  />
                            </>
                        ))}
                    </SortableContext>
                </div>
            </DndContext>

            {pages.map((page) => (
                <>
                    <span>{page.title}</span> <Button onClick={() => addToList(page)}>Add</Button>
                </>
            ))}
        </div>
    );
}