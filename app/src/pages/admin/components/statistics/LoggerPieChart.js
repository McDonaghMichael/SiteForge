import {Card} from "react-bootstrap";
import {Pie} from "react-chartjs-2";
import {useEffect, useState} from "react";
import axios from "axios";
import {numToMonthDate} from "../../../../widgets/Utils";

export default function LoggerPieChart({index}) {

    const [data, setData] = useState({});
    const [info, setInfo] = useState(null);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const PAGES_INDEX = 0;
    const POSTS_INDEX = 1;
    const ACCOUNTS_INDEX = 2;

    useEffect(() => {

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        axios.get("http://localhost:8080/logs")
            .then(res => {

                const pagesCreated = res.data.filter((item) => {
                    const itemDate = new Date(item.timestamp);
                    return item.actioncode === 2 && item.category === 0 && itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
                }).length;

                const pagesUpdated = res.data.filter((item) => {
                    const itemDate = new Date(item.timestamp);
                    return item.actioncode === 1 && item.category === 0 && itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
                }).length;

                const pagesDeleted = res.data.filter(item => {
                    const itemDate = new Date(item.timestamp);
                    return item.actioncode === 0 && item.category === 0 && itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
                }).length;

                const postsCreated = res.data.filter((item) => {
                    const itemDate = new Date(item.timestamp);
                    return item.actioncode === 2 && item.category === 1 && itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
                }).length;

                const postsUpdated = res.data.filter((item) => {
                    const itemDate = new Date(item.timestamp);
                    return item.actioncode === 1 && item.category === 1 && itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
                }).length;

                const postsDeleted = res.data.filter(item => {
                    const itemDate = new Date(item.timestamp);
                    return item.actioncode === 0 && item.category === 1 && itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
                }).length;

                const accountsCreated = res.data.filter((item) => {
                    const itemDate = new Date(item.timestamp);
                    return item.actioncode === 2 && item.category === 3 && itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
                }).length;

                const accountsUpdated = res.data.filter((item) => {
                    const itemDate = new Date(item.timestamp);
                    return item.actioncode === 1 && item.category === 3 && itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
                }).length;

                const accountsDeleted = res.data.filter(item => {
                    const itemDate = new Date(item.timestamp);
                    return item.actioncode === 0 && item.category === 3 && itemDate.getFullYear() === currentYear && itemDate.getMonth() === currentMonth;
                }).length;

                switch(index){
                    case PAGES_INDEX:
                        setData({label: "Pages", headers: ["Created", "Deleted", "Updated"], data: [ pagesCreated, pagesDeleted, pagesUpdated ]});
                        break;
                    case POSTS_INDEX:
                        setData({label: "Posts", headers: ["Created", "Deleted", "Updated"], data: [ postsCreated, postsDeleted, postsUpdated ]});
                        break;
                    case ACCOUNTS_INDEX:
                        setData({label: "Accounts", headers: ["Created", "Deleted", "Updated"], data: [ accountsCreated, accountsDeleted, accountsUpdated ]});
                        break;
                }

            })
            .catch(err => {
                setError(true);
                setErrorMessage(err.message);
            });
    }, [index]);

    useEffect(() => {
        setInfo({
            labels: data.headers,
            datasets: [
                {
                    label: data.label,
                    data: data.data,
                    backgroundColor: [
                        'rgb(255,99,132)',
                        'rgb(54,162,235)',
                        'rgb(245,250,54)',
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgb(204,208,52)',
                    ],
                    borderWidth: 1,
                },
            ],
        });
    }, [data, index])

    return (
        <>
            <Card>
                <Card.Header>{data.label} | {numToMonthDate(new Date().getMonth() + 1)}</Card.Header>
                <Card.Body>
                    {info && <Pie data={info} />}
                </Card.Body>
            </Card>
        </>
    )
}