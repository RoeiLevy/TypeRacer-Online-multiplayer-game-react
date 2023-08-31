import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

export const CountDown = forwardRef(({ targetTime, isGameOn, setIsInputDisabled }, ref) => {
    const [elapsed, setElapsed] = useState('')
    const [intervalId, setIntervalId] = useState(null)
    useEffect(() => {

        function formatTime(milliseconds) {
            const minutes = Math.floor(milliseconds / (60 * 1000));
            const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);

            const formattedMinutes = String(minutes).padStart(2, '0');
            const formattedSeconds = String(seconds).padStart(2, '0');

            return `${formattedMinutes}:${formattedSeconds}`;
        }

        function updateTimer() {
            const now = Date.now();
            const timeDifference = targetTime - now;

            if (timeDifference > 0) {
                const countdown = formatTime(timeDifference);
                timerElement.textContent = countdown;
            } else if (timeDifference <= 0) {
                const elapsedTime = now - targetTime;
                const elapsed = formatTime(elapsedTime);
                setElapsed(elapsed)
                timerElement.textContent = `${elapsed}`;
            }
        }

        const timerElement = document.getElementById('countdown');
        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        setIntervalId(interval)

        setTimeout(() => {
            setIsInputDisabled(false)
        }, targetTime - Date.now())
    }, [targetTime])

    useEffect(() => {
        if (!isGameOn) {
            clearInterval(intervalId)
        }

    }, [isGameOn])

    useImperativeHandle(ref, () => ({
        elapsed,
    }));

    return (
        <div id="countdown"></div>
    )
})