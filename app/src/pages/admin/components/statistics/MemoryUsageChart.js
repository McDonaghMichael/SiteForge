import { useEffect, useState } from "react";
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

export default function MemoryUsageChart() {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: "Memory Used (%)",
                data: [],
                borderColor: "rgb(39,233,239)",
                backgroundColor: "rgba(78,190,232,0.5)",
            },
        ],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://185.81.166.93:8182/memoryUsage");
                const { usedPercent } = response.data;
                const timestamp = new Date().toLocaleTimeString();

                setChartData((prevData) => {
                    const newLabels = [...prevData.labels, timestamp];
                    const newData = [...prevData.datasets[0].data, usedPercent];

                    if (newLabels.length > 15) {
                        newLabels.shift();
                        newData.shift();
                    }

                    return {
                        labels: newLabels,
                        datasets: [
                            {
                                ...prevData.datasets[0],
                                data: newData,
                            },
                        ],
                    };
                });
            } catch (error) {
                console.error("Error fetching memory usage:", error);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Memory Usage (%)",
            },
        },
    };

    return <Line options={options} data={chartData} />;
}