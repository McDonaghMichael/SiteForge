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
import {createElement, useEffect, useLayoutEffect, useState} from "react";
import BasePage from "./pages/global/base/BasePage";
import ImportThemePage from "./pages/admin/themes/import/ImportThemePage";
import ViewThemePage from "./pages/admin/themes/view/ViewThemePage";
import CreateAccount from "./pages/admin/accounts/create/CreateAccount";
import EditAccount from "./pages/admin/accounts/edit/EditAccount";
import NotFoundPage from "./pages/global/404/NotFoundPage";
import ViewPosts from "./pages/admin/posts/ViewPosts";
import LoginPage from "./pages/admin/authentication/login/LoginPage";

import './App.css';
import LoggerPage from "./pages/admin/logger/LoggerPage";
import {DynamicFavicon} from "./pages/admin/components/DynamicFavicon";
import withAuth from "./pages/admin/authentication/withAuth";


function App() {

    const [theme, setTheme] = useState([]);
    const [settings, setSettings] = useState([])
    const [loading, setLoading] = useState(false);
    const [pages, setPages] = useState([]);
    const [posts, setPosts] = useState([]);
    const [faviconUrl, setFaviconUrl] = useState('/favicon.png');

    useEffect(() => {
        axios.get("http://185.81.166.93:8182/pages").then(res => {
            setPages(res.data);

        })
    }, []);

    useEffect(() => {
        axios.get("http://185.81.166.93:8182/posts").then(res => {
            setPosts(res.data);

        })
    }, []);


    useLayoutEffect(() => {

        axios.get("http://185.81.166.93:8182/settings").then(res => {
            setSettings(res.data);
            setFaviconUrl(res.data.fav_icon);
            console.log("settings");
            console.log(res.data);
        })
        axios.get("http://185.81.166.93:8182/theme")
            .then(res => {
                setTheme(res.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching theme:", error);
                setLoading(false);
            });
    }, []);




    DynamicFavicon(faviconUrl);


    if (!settings) {

        return (
            <div>Loading...</div>
        );
    }


    const ProtectedDashboard = withAuth(Dashboard);
    return (
    <Routes>

        {pages && pages.map((item, index) => (
            <Route key={index} path={item.slug} element={<BasePage theme={theme} page={item} settings={settings} />} />
        ))}

        {posts && posts.map((item, index) => (
            <Route key={index} path={`/posts/${item.slug}`} element={<BasePage theme={theme} page={item} settings={settings} />} />
        ))}

        <Route path="*" element={<NotFoundPage theme={theme} settings={settings} />} />
        <Route path="/admin/" element={createElement(withAuth(Dashboard))} />
        <Route path="/admin/logger" element={createElement(withAuth(LoggerPage))} />
        <Route path="/admin/login" element={<LoginPage />} /> // Leave login unprotected
        <Route path="/admin/settings" element={createElement(withAuth(SettingsPage))} />
        <Route path="/admin/accounts" element={createElement(withAuth(AccountsPage))} />
        <Route path="/admin/account/create" element={createElement(withAuth(CreateAccount))} />
        <Route path="/admin/account/edit/:id" element={createElement(withAuth(EditAccount))} />
        <Route path="/admin/themes" element={createElement(withAuth(ThemesPage))} />
        <Route path="/admin/theme/import" element={createElement(withAuth(ImportThemePage))} />
        <Route path="/admin/theme/view/:id" element={createElement(withAuth(ViewThemePage))} />
        <Route path="/admin/pages" element={createElement(withAuth(ViewPages))} />
        <Route path="/admin/page/create" element={createElement(withAuth(CreatePage))} />
        <Route path="/admin/page/edit/:id" element={createElement(withAuth(EditPage))} />
        <Route path="/admin/posts" element={createElement(withAuth(ViewPosts))} />
        <Route path="/admin/post/create" element={createElement(withAuth(CreatePosts))} />
        <Route path="/admin/post/edit/:id" element={createElement(withAuth(EditPost))} />


    </Routes>
  );
}

export default App;
