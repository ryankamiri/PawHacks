import React, {useState, useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import UserContext from '../../context/user.context';
import Loading from '../loading';
import Axios from 'axios';
import { toast } from 'react-toastify';
import InstructorNavbar from './instructor_navbar';

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState();

    const [ready, setReady] = useState(false);

    const {userData} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if(!userData.user) {
            return navigate('/instructor/login');
        } else if (userData.user && !userData.instructor) {
            return navigate('/student');
        }
    }, [navigate, userData]);
    
    useEffect(() => {
        const getData = async() => {
          try{
            const pointsRes = await Axios.post(process.env.REACT_APP_DOMAIN + '/api/instructor/points', { instructorCode: userData.instructorCode});
            setLeaderboard(pointsRes.data.points);

            setReady(true);
          }
          catch(err){
            toast.error(err.response.data.msg, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: true,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        };
  
        getData();
  
      }, [userData]);

    return (
        <>
            <InstructorNavbar />
            {ready ? (
                <div
                    className="container-fluid bg-black mt-5 pt-2"
                    style={{height: "95vh", overflowY: "auto"}}
                >
                    <div className="card bg-dark mt-2 mx-5">
                        <h5 className="card-header text-center text-light py-4">Leaderboard</h5>
                        <div className="px-5 mx-5">
                            <table className="table table-border mt-2 table-dark ">
                                <thead>
                                    <tr>
                                    <th className="colname" scope="col">#</th>
                                    <th className="colname" scope="col">Username</th>
                                    <th className="colname" scope="col">Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((leaderboardData, i) => {
                                        return (
                                            <tr key={"Leaderboard " + i}>
                                                <td>{i+1}</td>
                                                <td>{leaderboardData.user}</td>
                                                <td>{leaderboardData.points}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
              </div>
            ) : (
                <Loading />
            )}
        </>
    )
}