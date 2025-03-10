import axios from "axios";

import {Route, Routes} from "react-router-dom";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import ViewPages from "./pages/admin/pages/ViewPages";
import CreatePage from "./pages/admin/pages/create/CreatePage";
import EditPage from "./pages/admin/pages/edit/EditPage";
import CreatePosts from "./pages/admin/posts/create/CreatePosts";
import EditPost from "./pages/admin/posts/edit/EditPost";
import ThemesPage from "./pages/admin/themes/ThemesPage";
import AccountsPage from "./pages/admin/accounts/AccountsPage";
import SettingsPage from "./pages/admin/settings/SettingsPage";
import {useEffect, useLayoutEffect, useState} from "react";
import BasePage from "./pages/global/base/BasePage";
import ImportThemePage from "./pages/admin/themes/import/ImportThemePage";
import ViewThemePage from "./pages/admin/themes/view/ViewThemePage";
import CreateAccount from "./pages/admin/accounts/create/CreateAccount";
import EditAccount from "./pages/admin/accounts/edit/EditAccount";
import NotFoundPage from "./pages/global/404/NotFoundPage";
import ViewPosts from "./pages/admin/posts/ViewPosts";
import LoginPage from "./pages/admin/authentication/login/LoginPage";
import './App.css';

function App() {

    const [theme, setTheme] = useState([]);
    const [settings, setSettings] = useState([])
    const [loading, setLoading] = useState(false);
    const [pages, setPages] = useState([]);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/pages").then(res => {
            setPages(res.data);

        })
    }, []);

    useEffect(() => {
        axios.get("http://localhost:8080/posts").then(res => {
            setPosts(res.data);

        })
    }, []);


    useLayoutEffect(() => {

        axios.get("http://localhost:8080/settings").then(res => {
            setSettings(res.data);
            console.log("settings");
            console.log(res.data);
        })
        axios.get("http://localhost:8080/theme")
            .then(res => {
                setTheme(res.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching theme:", error);
                setLoading(false);
            });
    }, []);


    if (!settings) {

        return <div>Loading...</div>;
    }


    return (
    <Routes>

        {pages.map((item, index) => (
            <Route key={index} path={item.slug} element={<BasePage theme={theme} page={item} settings={settings} />} />
        ))}

        {posts.map((item, index) => (
            <Route key={index} path={`/posts/${item.slug}`} element={<BasePage theme={theme} page={item} settings={settings} />} />
        ))}

        <Route path="*" element={<NotFoundPage theme={theme}/>}/>
        <Route path="/admin/" element={<Dashboard/>}/>
        <Route path="/admin/login" element={<LoginPage/>}/>
        <Route path="/admin/settings" element={<SettingsPage/>}/>
        <Route path="/admin/accounts" element={<AccountsPage/>}/>
        <Route path="/admin/account/create" element={<CreateAccount/>}/>
        <Route path="/admin/account/edit/:id" element={<EditAccount/>}/>
        <Route path="/admin/themes" element={<ThemesPage/>}/>
        <Route path="/admin/theme/import" element={<ImportThemePage/>}/>
        <Route path="/admin/theme/view/:id" element={<ViewThemePage/>}/>
        <Route path="/admin/pages" element={<ViewPages/>}/>
        <Route path="/admin/page/create" element={<CreatePage/>}/>
        <Route path="/admin/page/edit/:id" element={<EditPage/>}/>
        <Route path="/admin/posts" element={<ViewPosts/>}/>
        <Route path="/admin/post/create" element={<CreatePosts/>}/>
        <Route path="/admin/post/edit/:id" element={<EditPost/>}/>
    </Routes>
  );
}

export default App;
