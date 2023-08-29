import { useLocation, useNavigate } from 'react-router-dom';
import './AppHeader.scss'
import { TabMenu } from 'primereact/tabmenu';
import { useEffect, useState } from 'react';

export const AppHeader = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [activeIndex, setActiveIndex] = useState(null)
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
        </header>
    )
}