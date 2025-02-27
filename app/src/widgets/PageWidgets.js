import axios from "axios";

export function getTime(){
    let date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

export function getPagesList(){
    const res = axios.get('http://localhost:8080/pages');


}