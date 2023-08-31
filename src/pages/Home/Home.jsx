import { useEffect, useRef, useState } from 'react'
import { socketService } from '../../services/socket.service'
import { ProgressBar } from 'primereact/progressbar';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { CountDown } from '../../cmps/Countdown/CountDown';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setRoom } from '../../store/features/game/gameSlice';
import 'firebase/auth';
import './Home.scss'
import { ProgressSpinner } from 'primereact/progressspinner';

export const Home = () => {
    const [isGameOn, setIsGameOn] = useState(true)
    const [isInputDisabled, setIsInputDisabled] = useState(true)
    const [visible, setVisible] = useState(true);
    const [inputValue, setInputValue] = useState('')
    const [currentLetterIdx, setCurrentLetterIdx] = useState(0)
    const toast = useRef(null);
    const countDownRef = useRef(null);
    const inputRef = useRef(null)
    const { user, room } = useSelector((state) => state.game)
    const dispatch = useDispatch()

    useEffect(() => {
        socketService.emit('ping', null)
        socketService.on('update-room', (room) => dispatch(setRoom(room)))
        socketService.on('end-game', () => {
            setIsGameOn(false)
        })
    }, [])

    useEffect(() => {
        if (!isInputDisabled) {
            inputRef.current.focus()
        }
    }, [isInputDisabled])

    const setPlayerLogin = async (loginType) => {
        let id = Math.random().toString(36).substring(2)
        let username = `Guest${Math.floor(100000 + Math.random() * 900000)}`
        let isLogin = false
        if (loginType === 'Guest') {
            dispatch(setUser({ id, username, isLogin, progress: 0, isBot: false }))
        } else if (loginType === 'Google') {
            const auth = getAuth()
            const provider = new GoogleAuthProvider()
            const { user } = await signInWithPopup(auth, provider)
            id = user.uid
            username = user.displayName
            isLogin = true
            dispatch(setUser({ id, username, isLogin, progress: 0, isBot: false }))
        }
        setVisible(false)
    }

    const handleChangeInput = (e) => {
        const { value } = e.target
        if (value.length < inputValue.length) {
            document.querySelector(`.letter-${currentLetterIdx - 1}`).style.color = ''
            setCurrentLetterIdx(currentLetterIdx - 1)
            setInputValue(value)
            return
        }
        setInputValue(value)
        const lastWrittenLetter = value.charAt(value.length - 1)
        if (lastWrittenLetter === room.quote.text[currentLetterIdx]) {
            document.querySelector(`.letter-${currentLetterIdx}`).style.color = 'green'
            setCurrentLetterIdx(currentLetterIdx + 1)
        } else {
            document.querySelector(`.letter-${currentLetterIdx}`).style.color = 'red'
            setCurrentLetterIdx(currentLetterIdx + 1)
        }
        const progress = getProgress()
        if (progress === 100) {
            setIsInputDisabled(true)
            const wpm = ((60 / (Math.round(Date.now() - room.startTimestamp) / 1000)) * room.quote.text.split(' ').length).toFixed(0)
            const timeToFinish = countDownRef.current.elapsed
            dispatch(setUser({ ...user, wpm, timeToFinish, progress }))
        } else dispatch(setUser({ ...user, progress }))
    }

    useEffect(() => {
        if (!user) return
        if (!room || user.progress === 0) {
            socketService.emit('play', user)
            return
        }
        socketService.emit('update-player', { player: user, roomId: room.id })
    }, [user])

    const getProgress = () => {
        return Math.floor((currentLetterIdx + 1) / room.quote.text.length * 100)
    }

    const formatTimeStringToWords = (timeString) => {
        const [minutesStr, secondsStr] = timeString.split(':');
        const minutes = parseInt(minutesStr, 10);
        const seconds = parseInt(secondsStr, 10);

        let result = '';
        if (minutes > 0) {
            result += `${minutes} minute${minutes > 1 ? 's' : ''} `;
        }
        if (seconds > 0) {
            result += `${seconds} second${seconds > 1 ? 's' : ''}`;
        }

        return result.trim();
    }

    const handlePaste = (e) => {
        e.preventDefault()
        toast.current.show({ severity: 'warn', summary: 'Impossible action', detail: 'Paste is not allowed!', life: 3000 });
    }

    const playAgain = () => {
        document.querySelectorAll('.letter').forEach(el => {
            el.style.color = ''
        })
        setIsInputDisabled(true)
        setInputValue('')
        setCurrentLetterIdx(0)
        dispatch(setUser({ ...user, progress: 0, wpm: 0, timeToFinish: '' }))
        dispatch(setRoom(null))
        setIsGameOn(true)
    }

    const headerContent = <div>Choose how you would like to play</div>;

    if (room) {
        return (
            <div className="home container">
                <div className="timer">
                    <CountDown ref={countDownRef} isGameOn={isGameOn} setIsInputDisabled={setIsInputDisabled} targetTime={room.startTimestamp} />
                </div>
                <div className="race">
                    {room.players.slice().sort((playerA, playerB) => {
                        if (playerA.id === user.id) {
                            return -1;
                        } else if (playerB?.id === user.id) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }).map(player => (
                        <div key={player.id} className="player">
                            <h5>{player.username}</h5>
                            <div className="progress">
                                <ProgressBar value={player.progress}></ProgressBar>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="quote">
                    <h3>
                        "{room.quote.text.split('').map((char, idx) => (
                            <span key={`letter-${idx}`} className={`letter letter-${idx}`}>{char}</span>
                        ))}" <span className='author'>(By {room.quote.author})</span>
                    </h3>
                    <InputText ref={inputRef} disabled={isInputDisabled || !isGameOn} value={inputValue} onChange={(e) => handleChangeInput(e)} onPaste={handlePaste} />
                    <Toast ref={toast} position="bottom-center" />
                </div>
                {room.results.length > 0 && <div className="results">

                    <h2>Scores <i className="pi pi-chart-bar"></i></h2>
                    {room.results.map(p => p.wpm && p.timeToFinish && (
                        <div key={p.id} className="result">
                            {`${p.username} finished the race in ${formatTimeStringToWords(p.timeToFinish)} and in a pace of ${p.wpm} words per minute.`}
                        </div>
                    ))}
                    <Button label="Play again" icon="pi pi-replay" iconPos="right" onClick={playAgain} />
                </div>}
            </div>
        )
    } else if (!user.id && !user.isLogin) {
        return (
            <div className="home container">
                <Dialog header={headerContent} visible={visible} style={{ width: '40vw', textAlign: 'center' }} onHide={() => setVisible(false)} aria-controls={visible ? 'dlg' : null} aria-expanded={visible ? true : false}>
                    <div style={{ margin: '0' }}>
                        <p style={{ margin: '0', marginBottom: '1.5rem' }}>In order to see your past results you have to login</p>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                            <Button severity="secondary" label="Play as a guest" onClick={() => setPlayerLogin('Guest')} />
                            <Button label="Login with Google" onClick={() => setPlayerLogin('Google')} autoFocus />
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    } else return (
        <div className="home conatiner">
            <ProgressSpinner />
        </div>
    )
}