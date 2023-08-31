import { useLocation, useNavigate } from 'react-router-dom';
import './AppHeader.scss'
import { TabMenu } from 'primereact/tabmenu';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { setRoom, setUser } from '../../store/features/game/gameSlice';
import { socketService } from '../../services/socket.service';

export const AppHeader = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [activeIndex, setActiveIndex] = useState(null)
    const { user, room } = useSelector((state) => state.game)
    const dispatch = useDispatch()
    const items = [
        {
            label: 'Home', icon: 'pi pi-fw pi-home', command: () => {
                // setVisibleRight(false)
                navigate('/')
            }
        },
        {
            label: 'Score Board', icon: 'pi pi-chart-bar', command: () => {
                // setVisibleRight(false)
                navigate('/score-board')
            }
        },
        // {
        //     label: 'About', icon: 'pi pi-info-circle', command: () => {
        //         // setVisibleRight(false)
        //         navigate('/about')
        //     }
        // }
    ];

    const login = async () => {
        socketService.emit('leave', { player: { id: user.id }, roomId: room.id })
        dispatch(setRoom(null))
        const auth = getAuth()
        const provider = new GoogleAuthProvider()
        const { user: googleUser } = await signInWithPopup(auth, provider)
        const id = googleUser.uid
        const username = googleUser.displayName
        const isLogin = true
        dispatch(setUser({ id, username, isLogin }))
    }

    useEffect(() => {
        if (location.pathname === '/') {
            setActiveIndex(0)
        } else if (location.pathname === '/score-board') {
            setActiveIndex(1)
        } else {
            setActiveIndex(2)
        }
    }, [location.pathname]);

    return (activeIndex !== null &&
        <header className="app-header container">
            <h1>TypeRacer</h1>
            <TabMenu activeIndex={activeIndex} model={items} />
            <div className="user">
                {!user?.isLogin ? <Button label="Login with Google" onClick={login} autoFocus /> : user.username}
            </div>
        </header>
    )
}