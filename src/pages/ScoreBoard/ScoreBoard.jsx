import { useEffect, useState } from 'react'
import './ScoreBoard.scss'
import { getScoresByUserId } from '../../services/api.service'
import { Fieldset } from 'primereact/fieldset';
import { useDispatch, useSelector } from 'react-redux';
import { ProgressSpinner } from 'primereact/progressspinner';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { setUser } from '../../store/features/user/userSlice';

export const ScoreBoard = () => {
    const [scores, setScores] = useState(null)
    const { user } = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const login = async () => {
        const auth = getAuth()
        const provider = new GoogleAuthProvider()
        const { user } = await signInWithPopup(auth, provider)
        const id = user.uid
        const username = user.displayName
        const isLogin = true
        dispatch(setUser({ id, username, isLogin }))
    }

    useEffect(() => {
        if (!user?.isLogin) return
        (async function () {
            const playerScores = await getScoresByUserId('yk5ZJC2p1sgHakNapkh7ir3EzLP2')
            setScores(playerScores)
        })()
    }, [user])

    if (user?.isLogin) {
        if (!scores) {
            return <div className="score-board container">
                <ProgressSpinner />
            </div>
        } else return (
            <div className="score-board container">
                <Fieldset legend="My Scores" toggleable>
                    <div className="scores">
                        {scores && scores.map(score => (
                            <div key={score.id} className="score">
                                <h4>"{score.quote.text}"</h4>
                                <p>{` Played at ${new Date(score.startTimestamp).toDateString()} `}</p>
                                <div>{`You have finished this quote in ${score.players.timeToFinish} and in a pace of ${score.players.wpm} words per minute.`}</div>
                            </div>
                        ))}
                    </div>
                </Fieldset>
                {/* <Fieldset legend="Global Scores" toggleable collapsed={true}> */}
                    {/* <div className="scores">
                {scores && scores.map(score => (
                        <div className="score">
                        <h4>{score.quote.text}</h4>
                        <div>{`You have finished this quote in ${score.players.timeToFinish} and in a pace of ${score.players.wpm} words per minute.`}</div>
                        
                        </div>
                        ))}
                    </div> */}
                {/* </Fieldset> */}
            </div>
        )
    } else {
        return (
            <div className='score-board container'>
                <div className="login">
                    <span onClick={login}>Login</span> to see your scores!
                </div>
            </div>
        )
    }
}