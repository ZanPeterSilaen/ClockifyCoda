import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Home = () => {
    const [listOfHeaders, setListOfHeaders] = useState([])
    const [tasksId, setTasksId] = useState([])
    const [tasksIdClock, setTasksIdClock] = useState([])
    const [tasksName, setTasksName] = useState([])
    const [tasksNameClock, setTasksNameClock] = useState([])
    const [selectedTaskId, setSelectedTaskId] = useState('')

    const [tugasCoda, setTugasCoda] = useState([])
    const [tugasClockify, setTugasClockify] = useState([])

    const [manusia, setManusia] = useState([]);

    const [codaData, setCodaData] = useState(null);
    const [firstValueKey, setFirstValueKey] = useState('');

    let [tokenCoda, setTokenCoda] = useState('')
    let [tokenClockify, setTokenClockify] = useState('')

    const [result, setResult] = useState([])

    useEffect(() => {
        axios.get("http://localhost:5000/headers").then((response) => {
            setListOfHeaders(response.data)
            for (let p = 0; p < response.data.length; p++) {
                console.log(response.data[p].clockify_token);
                setTokenCoda(response.data[p].coda_token);
                setTokenClockify(response.data[p].clockify_token);
            }
        })
    }, [])

    const codaHeaders = {
        "Authorization": `Bearer ${tokenCoda}`,
        "Content-Type": "application/json"
    };

    const clockifyHeaders = {
        "X-Api-Key": `${tokenClockify}`,
        "Content-Type": "application/json"
    }

    console.log(clockifyHeaders);

    useEffect(() => {
        console.log("Fetching Clockify data...");
        fetchCoda();
        fetchClockify();

        const CodaIntervalId = setInterval(fetchCoda, 10000);
        const ClockIntervalId = setInterval(fetchClockify, 10000);

        return () => {
            clearInterval(CodaIntervalId)
            clearInterval(ClockIntervalId)
        };

    }, [listOfHeaders]);

    const handleTaskSelection = (event) => {
        setSelectedTaskId(event.target.value);
    };

    let pilihan;

    pilihan = selectedTaskId;

    function fetchCoda() {
        const urlCoda = "https://coda.io/apis/v1/docs"
        fetch(urlCoda, { headers: codaHeaders })
            .then(response => response.json())
            .then(data => {
                const codaTasksId = data.items.map(item => item.id);
                setTasksId(codaTasksId);
                const codaTasksName = data.items.map(item => item.name);
                setTasksName(codaTasksName);
                console.log(data);

                console.log(pilihan);

                fetch(`${urlCoda}/${pilihan}/tables`, { headers: codaHeaders })
                    .then(response => response.json())
                    .then(datum => {
                        for (let j = 0; j < datum.items.length; j++) {
                            console.log(datum.items[j].name);
                            if (datum.items[j].name === "Backlog") {
                                let isi = [];

                                fetch(`${urlCoda}/${selectedTaskId}/tables/${datum.items[j].id}/rows`, { headers: codaHeaders })
                                    .then(response => response.json())
                                    .then(hasil => {
                                        for (let k = hasil.items.length - 1; k >= 0; k--) {
                                            isi.push(hasil.items[k]);
                                        }
                                        setCodaData(isi);

                                        setTugasCoda(isi)

                                        const values = hasil.items[0]?.values; // Use the first item to get the values
                                        const firstKey = Object.keys(values)[1]; // Assuming you want the second key
                                        setFirstValueKey(firstKey);
                                        console.log(firstValueKey);
                                    })
                            }
                        }
                    })
                    .catch(error => {
                        console.error("error fetch datum", error.msg);
                    })
            })
            .catch(error => {
                console.error("error fetch coda data", error.msg);
            });
    }

    let codaAssignment = []

    for (let l = 0; l < tugasCoda.length; l++) {
        codaAssignment.push(tugasCoda[l].name)
        // console.log(tugasCoda[l]);
    }

    console.log(codaAssignment);
    // let lalu;
    console.log(result.length);

    function fetchClockify() {
        const urlClockify = "https://api.clockify.me/api/v1/workspaces"
        fetch(urlClockify, { headers: clockifyHeaders })
            .then(response => response.json())
            .then(data => {
                const clockTasksId = data.map(item => item.id);
                setTasksIdClock(clockTasksId);
                const clockTasksName = data.map(item => item.name);
                setTasksNameClock(clockTasksName);
                console.log(pilihan);

                fetch(`${urlClockify}/${selectedTaskId}/users`, { headers: clockifyHeaders })
                    .then(response => response.json())
                    .then(user => {
                        const human = user.map(item => item.name);
                        setManusia(human)

                        fetch(`${urlClockify}/${selectedTaskId}/projects`, { headers: clockifyHeaders })
                            .then(response => response.json())
                            .then(hasil => {
                                const namaTaskClock = hasil.map(item => item.name);
                                setTugasClockify(namaTaskClock);

                                // console.log(lalu);
                                let lalu;
                                setResult(codaAssignment.filter(item => !tugasClockify.includes(item)));

                                console.log(lalu);

                                console.log(result);

                                console.log(result.length);
                                for (let j = 0; j < result.length; j++) {
                                    const clockifyTask = {
                                        "name": result[j],
                                    };

                                    fetch(`${urlClockify}/${selectedTaskId}/projects`, {
                                        headers: clockifyHeaders,
                                        method: "POST",
                                        body: JSON.stringify(clockifyTask)
                                    })
                                        .then(response => response.json())
                                        .then(kirim => {
                                            console.log("Task clockify added successfully", kirim);
                                        })
                                }
                            })
                            .catch(error => {
                                console.error("error clock", error.msg);
                            })
                    })
                    .catch(error => {
                        console.error("user error", error.msg);
                    })
            })
            .catch(error => {
                console.error("Error clockify", error.msg);
            })
    }

    console.log(tugasClockify);

    useEffect(() => {
        // Fetch data based on selectedTaskId here
        if (selectedTaskId) {
            fetchCoda(selectedTaskId);
            fetchClockify(selectedTaskId);
        }
    }, [selectedTaskId]);

    console.log(selectedTaskId);

    return (
        <div>
            <table border='10' cellPadding='10' cellSpacing="0" className='table table-xs'>
                <tr>
                    <th>Nomor</th>
                    <th>Token Coda</th>
                    <th>Coda Projects List</th>
                    <th>Token Clockify</th>
                    <th>Clockify Projects List</th>
                    <th>Projects</th>
                    <th>People</th>
                </tr>
                <tbody>
                    {listOfHeaders.map((value, key) => {
                        return (
                            <tr key={key} className='hover'>
                                <td>{key + 1}</td>
                                <td>{value.coda_token}</td>
                                <td>
                                    <select className='menu bg-base-200 w-56' onChange={handleTaskSelection}>
                                        <option value="">Select one</option>
                                        {tasksId.map((task, index) => (
                                            <option key={index} value={task}>{tasksName[index]}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>{value.clockify_token}</td>
                                <td>
                                    <select className='menu bg-base-200 w-56' onChange={handleTaskSelection}>
                                        <option value="">Select one</option>
                                        {tasksIdClock.map((task, index) => (
                                            <option key={index} value={task}>{tasksName[index]}</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    {tugasClockify && tugasClockify.length > 0 ? (
                                        <ul className="w-56">
                                            {tugasClockify.map(item => (
                                                <li className='mt-2' key={item.id}>
                                                    {item}
                                                </li>
                                            ))}
                                            { }
                                        </ul>
                                    ) : (
                                        <em className='text-center'>Loading data...</em>
                                    )}
                                </td>
                                <td>
                                    <ul className="menu w-56 rounded-box">
                                        {manusia.map((item, index) => (
                                            <li key={index} value={item}>{manusia[index]}</li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default Home;
