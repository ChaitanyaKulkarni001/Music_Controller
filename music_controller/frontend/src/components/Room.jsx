import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import CreateRoomPage from './CreateRoomPage.jsx';

const Room = ({ setRoom }) => {
    const [guest_can_pause, setGuest_can_pause] = useState(false);
    const [votes_to_skip, setVotes_to_skip] = useState(2);
    const [isHost, setIsHost] = useState(false);
    const [setting, setSetting] = useState(false)
    const { roomcode } = useParams();
    const [spotify_authenticated, setSpotify_authenticated] = useState(false)
    const navigate = useNavigate();
    const [word, setword] = useState("")
    const [song, setSong] = useState()
    const [para, setpara] = useState()
    const authenticate_spotify = () => {
        fetch('/spotify/is-authenticated')
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setSpotify_authenticated(data.status);
                if (!data.status) {
                    fetch('/spotify/get-auth-url')
                        .then((res) => res.json())
                        .then((data) => {
                            window.location.replace(data.url);
                        });
                }
            });
    };
   
    const getRoomDetails = () => {
        fetch(`/api/get-room?code=${roomcode}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("DATA is",data);
                setGuest_can_pause(data.guest_can_pause);
                setVotes_to_skip(data.votes_to_skip);
                setIsHost(data.is_host);
                console.log("isHost: ", data.is_host);
                if (data.is_host) {
                    setword(
                        <span class="material-symbols-outlined flex justify-end align-top hover:cursor-pointer" onClick={() => { setSetting(true) }}>settings</span>
                    )
                    authenticate_spotify();
                }
            });
    };

    useEffect(() => {
        getRoomDetails();
    }, [setting]);
    
    useEffect(()=>{
        getCurrentSong();

    },[1000])

    const getCurrentSong=()=>{
        fetch('/spotify/current-song').then((res)=>res.json()).then((data)=>{
            setSong(data)
                console.log(data);
            setpara( <p>
                Title : {data.title} <br />
                arist : {data.artist} <br />
                duration : {data.duration}<br />
                <img src={data.image_url} alt="Image" />
                time:{data.time}<br />
                {/* {data.image_url}<br /> */}
                Paused : {data.is_playing?"No":"Yes"}<br />
                Votes : {data.votes}<br />
                id:{data.id}<br />
                </p>)
        })
    }

    const leaveRoom = () => {
        console.log("Leaving room...");
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };

        fetch("/api/leave-room", requestOptions).then((r) => {
            setRoom(null);
            navigate(`/`);
        });
    };

    if (setting) {
        return (
            <CreateRoomPage
                update={true}
                code={roomcode}
                guest_can_pauses={guest_can_pause}
                votes_to_skips={votes_to_skip}
                getRoomDetails={getRoomDetails}
                setSetting={setSetting}
            />
        );
    }
    return (
        <div className="min-h-screen bg-gray-600 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-md p-8 w-full md:w-1/2 lg:w-1/3">
            
                
            {word}
            
                <h1 className="text-3xl font-bold text-center mb-4">Room Code: {roomcode}</h1>
                <div className="flex flex-col items-center">
                    <p className="text-gray-700 mb-2">
                        Votes to skip: {votes_to_skip}
                    </p>
                    <p className="text-gray-700 mb-2">
                        Guest can pause: {guest_can_pause.toString()}
                    </p>
                    <p className="text-gray-700 mb-2">
                        Host: {isHost.toString()}
                    </p>
                   {para}
                        {/* 'title': item.get('name'),
            'artist': artist_string,
            'duration': duration,
            'time': progress,
            'image_url': album_cover,
            'is_playing': is_playing,
            'votes': 0,
            'id': song_id */}

                    <button
                        onClick={leaveRoom}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out"
                    >
                        Leave Room
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Room;
// const Room = ({ setRoom }) => {
//     const [guest_can_pause, setGuest_can_pause] = useState(false);
//     const [votes_to_skip, setVotes_to_skip] = useState(2);
//     const [isHost, setIsHost] = useState(false);
//     const [setting, setSetting] = useState(false);
//     const { roomcode } = useParams();
//     const [spotify_authenticated, setSpotify_authenticated] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         getRoomDetails();
//     }, [setting]);

//     const authenticate_spotify = () => {
//         fetch('/spotify/is-authenticated')
//             .then((res) => res.json())
//             .then((data) => {
//                 setSpotify_authenticated(data.status);
//                 if (!data.status) {
//                     fetch('/spotify/get-auth-url')
//                         .then((res) => res.json())
//                         .then((data) => {
//                             window.location.replace(data.url);
//                         });
//                 }
//             });
//     };

//     const getRoomDetails = () => {
//         fetch(`/api/get-room?code=${roomcode}`)
//             .then((res) => res.json())
//             .then((data) => {
//                 console.log(data);
//                 setGuest_can_pause(data.guest_can_pause);
//                 setVotes_to_skip(data.votes_to_skip);
//                 setIsHost(data.is_host);

//                 if (!data.is_host) {
//                     authenticate_spotify();
//                 }
//             });
//     };

//     const leaveRoom = () => {
//         const requestOptions = {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//         };

//         fetch('/api/leave-room', requestOptions).then((r) => {
//             setRoom(null);
//             navigate(`/`);
//         });
//     };

//     if (setting) {
//         return (
//             <>
//                 <CreateRoomPage
//                     update={true}
//                     code={roomcode}
//                     guest_can_pauses={guest_can_pause}
//                     votes_to_skips={votes_to_skip}
//                     getRoomDetails={getRoomDetails}
//                     setSetting={setSetting}
//                 />
//             </>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-600 flex justify-center items-center">
//             <div className="bg-white rounded-lg shadow-md p-8 w-full md:w-1/2 lg:w-1/3">
//                 <span className="material-symbols-outlined flex justify-end align-top hover:cursor-pointer" onClick={() => setSetting(true)}>
//                     settings
//                 </span>
//                 <h1 className="text-3xl font-bold text-center mb-4">Room Code: {roomcode}</h1>
//                 <div className="flex flex-col items-center">
//                     <p className="text-gray-700 mb-2">Votes to skip: {votes_to_skip}</p>
//                     <p className="text-gray-700 mb-2">Guest can pause: {guest_can_pause.toString()}</p>
//                     <p className="text-gray-700 mb-2">Host: {isHost.toString()}</p>
//                     <button
//                         onClick={leaveRoom}
//                         className="bg-red-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out"
//                     >
//                         Leave Room
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Room;


