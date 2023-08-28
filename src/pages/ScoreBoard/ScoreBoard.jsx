import { useEffect, useState } from 'react'
import './ScoreBoard.scss'
import { getScoresByUserId } from '../../services/api.service'
import { Fieldset } from 'primereact/fieldset';
import { useSelector } from 'react-redux';
export const ScoreBoard = () => {
    const [scores, setScores] = useState(null)
    const { user } = useSelector((state) => state.user)

    useEffect(() => {
        if (!user?.isLogin) return
        (async function () {
            const playerScores = await getScoresByUserId('yk5ZJC2p1sgHakNapkh7ir3EzLP2')
            setScores(playerScores)
        })()
    }, [user])

    if (user?.isLogin) {
        return (
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
                <Fieldset legend="Global Scores" toggleable>
                    {/* <div className="scores">
                {scores && scores.map(score => (
                        <div className="score">
                        <h4>{score.quote.text}</h4>
                        <div>{`You have finished this quote in ${score.players.timeToFinish} and in a pace of ${score.players.wpm} words per minute.`}</div>
                        
                        </div>
                        ))}
                    </div> */}
                </Fieldset>

            </div>
        )
    } else {
        return (
            <div className='score-board container'>
                Login to see scores
            </div>
        )
    }
}