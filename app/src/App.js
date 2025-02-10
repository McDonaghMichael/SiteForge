import axios from "axios";

import './App.css';
import {Route, Routes} from "react-router-dom";
import Homepage from "./pages/global/homepage/Homepage";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import ViewPages from "./pages/admin/pages/view/ViewPages";
import CreatePage from "./pages/admin/pages/create/CreatePage";
import EditPage from "./pages/admin/pages/edit/EditPage";
import CreatePosts from "./pages/admin/posts/create/CreatePosts";
import EditPost from "./pages/admin/posts/edit/EditPost";
import ThemesPage from "./pages/admin/themes/ThemesPage";
import AccountsPage from "./pages/admin/accounts/AccountsPage";
import SettingsPage from "./pages/admin/settings/SettingsPage";
import {useEffect, useState} from "react";
import BasePage from "./pages/global/base/BasePage";

function App() {

    const [theme, setTheme] = useState([]);
    const [pages, setPages] = useState([]);

    useEffect(() => {
        const res = axios.get("http://localhost:8080/pages").then(res => {
            setPages(res.data);

        })
    }, []);

    useEffect(() => {
        axios.get("http://localhost:8080/theme").then(res => {
            setTheme(res.data[0]);
            console.log(theme);
        }).catch(error => {
            console.error("Error fetching theme:", error);
        });
    }, []);



    return (
    <Routes>

        {pages.map((item, index) => (
            <Route key={index} path={item.slug} element={<BasePage theme={theme} page={item} />} />
        ))}

        <Route path="/" element={<Homepage/>}/>
        <Route path="/admin/" element={<Dashboard/>}/>
        <Route path="/admin/settings" element={<SettingsPage/>}/>
        <Route path="/admin/accounts" element={<AccountsPage/>}/>
        <Route path="/admin/themes" element={<ThemesPage/>}/>
        <Route path="/admin/pages" element={<ViewPages/>}/>
        <Route path="/admin/pages/create" element={<CreatePage/>}/>
        <Route path="/admin/pages/edit/:id" element={<EditPage/>}/>
        <Route path="/admin/posts" element={<ViewPages/>}/>
        <Route path="/admin/posts/create" element={<CreatePosts/>}/>
        <Route path="/admin/posts/edit/:id" element={<EditPost/>}/>
    </Routes>
  );
}

export default App;
