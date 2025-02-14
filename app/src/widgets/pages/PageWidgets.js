import {useEffect, useState} from "react";
import axios from "axios";

var pages = []

const res = axios.get("http://localhost:8080/pages").then(res => {
    pages = res.data;
})


export function getTime() {
    return `<div class="widget-time">${Date.now().toString()}</div>`;
}

export function getPages(){
    return `<div class="widget-pages"><ul>${pages.map(item => `<li>${item.title}</li>`).join("")}</ul</div>`;
}