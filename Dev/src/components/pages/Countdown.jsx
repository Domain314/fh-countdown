import React, { useEffect, useState } from 'react';
import './Animations.css'

const TARGET_DATE = "2024-01-16T11:20:00.000Z";

const Countdown = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const timeUntilTarget = new Date(TARGET_DATE) - now;
            const days = Math.floor(timeUntilTarget / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeUntilTarget % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeUntilTarget % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeUntilTarget % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds });
        };

        calculateTimeLeft();
        const intervalId = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="text-white bg-black p-6 rounded-lg shadow-lg mt-8">
            <h1 className="text-rainbow animate-flow text-2xl font-bold mb-4 text-center mb-8">Countdown until last LV</h1>
            <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                    <p className="text-lg font-semibold">TOTAL</p>
                    <p className="text-xl">{timeLeft.days} Days</p>
                    <p className="text-xl">{timeLeft.hours} Hours</p>
                    <p className="text-xl">{timeLeft.minutes} Minutes</p>
                    <p className="text-xl">{timeLeft.seconds} Seconds</p>
                </div>
                <div className="text-center p-4">
                    <p className="text-lg font-semibold">IN WEEKS</p>
                    <p className="text-xl">{parseInt(timeLeft.days / 7)} Weeks</p>
                </div>
            </div>
        </div>

    );
};

export default Countdown;
