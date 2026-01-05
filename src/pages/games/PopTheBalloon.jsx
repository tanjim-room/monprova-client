import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const PopTheBalloon = () => {
    const navigate = useNavigate();
    const [balloons, setBalloons] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [highScore, setHighScore] = useState(0);

    const balloonColors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6', '#F472B6'];
    const balloonFaces = ['😄', '🤩', '😎', '😊', '🥳', '😁'];

    const createBalloon = useCallback(() => {
        const newBalloon = {
            id: Date.now() + Math.random(),
            left: Math.random() * 85 + '%',
            color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
            face: balloonFaces[Math.floor(Math.random() * balloonFaces.length)],
            size: Math.floor(Math.random() * 20) + 65,
            speed: Math.random() * 3 + 2,
            sway: Math.random() * 2 + 1.5,
        };
        return newBalloon;
    }, []);

    useEffect(() => {
        if (!isPlaying) return;

        const balloonInterval = setInterval(() => {
            setBalloons(prev => {
                const filtered = prev.filter(b => b.id);
                if (filtered.length < 8) {
                    return [...filtered, createBalloon()];
                }
                return filtered;
            });
        }, 1000);

        return () => clearInterval(balloonInterval);
    }, [isPlaying, createBalloon]);

    useEffect(() => {
        if (!isPlaying || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsPlaying(false);
                    setGameOver(true);
                    if (score > highScore) {
                        setHighScore(score);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isPlaying, timeLeft, score, highScore]);

    const handleBalloonPop = (id) => {
        setBalloons(prev => prev.filter(b => b.id !== id));
        setScore(prev => prev + 1);
    };

    const startGame = () => {
        setIsPlaying(true);
        setGameOver(false);
        setScore(0);
        setTimeLeft(30);
        setBalloons([]);
    };

    const restartGame = () => {
        startGame();
    };

    return (
        <div className="min-h-[850px] bg-gradient-to-br from-orange-100 via-red-50 to-orange-100 rounded-lg mt-16 p-10">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigate('/dashboardPatient/games')}
                        className="px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition shadow-md flex items-center gap-2"
                    >
                        <span>←</span>
                        <span>ফিরে যান</span>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">🎈 বেলুন ফাটান</h1>
                    <div className="w-32"></div>
                </div>

                {/* Stats Bar */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
                        <p className="text-sm text-gray-600 mb-1">স্কোর</p>
                        <p className="text-4xl font-bold text-orange-600">{score}</p>
                    </div>
                    <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
                        <p className="text-sm text-gray-600 mb-1">সময়</p>
                        <p className="text-4xl font-bold text-red-600">{timeLeft}s</p>
                    </div>
                    <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
                        <p className="text-sm text-gray-600 mb-1">সর্বোচ্চ স্কোর</p>
                        <p className="text-4xl font-bold text-purple-600">{highScore}</p>
                    </div>
                </div>

                {/* Game Area */}
                <div className="relative bg-gradient-to-b from-sky-300 to-sky-100 rounded-2xl shadow-2xl overflow-hidden" style={{ height: '500px' }}>
                    {!isPlaying && !gameOver && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-10">
                            <div className="text-8xl mb-6">🎈</div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">বেলুন ফাটানো শুরু করুন!</h2>
                            <p className="text-gray-600 mb-8 text-center max-w-md">
                                ৩০ সেকেন্ডের মধ্যে যত বেশি বেলুন ফাটাতে পারেন, তত বেশি স্কোর পাবেন!
                            </p>
                            <button
                                onClick={startGame}
                                className="px-12 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white text-xl font-bold rounded-full hover:from-orange-700 hover:to-red-700 transition shadow-lg hover:shadow-xl"
                            >
                                খেলা শুরু করুন
                            </button>
                        </div>
                    )}

                    {gameOver && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-95 z-10">
                            <div className="text-8xl mb-6">🎊</div>
                            <h2 className="text-4xl font-bold text-gray-800 mb-4">খেলা শেষ!</h2>
                            <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-8 mb-6">
                                <p className="text-gray-700 text-lg mb-2">আপনার স্কোর</p>
                                <p className="text-6xl font-bold text-orange-600">{score}</p>
                                {score === highScore && score > 0 && (
                                    <p className="text-green-600 font-semibold mt-2">🏆 নতুন রেকর্ড!</p>
                                )}
                            </div>
                            <button
                                onClick={restartGame}
                                className="px-12 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white text-xl font-bold rounded-full hover:from-orange-700 hover:to-red-700 transition shadow-lg hover:shadow-xl"
                            >
                                আবার খেলুন
                            </button>
                        </div>
                    )}

                    {/* Floating Balloons */}
                    {balloons.map((balloon) => (
                        <div
                            key={balloon.id}
                            onClick={() => handleBalloonPop(balloon.id)}
                            className="absolute cursor-pointer transition-all duration-100 hover:scale-110"
                            style={{
                                left: balloon.left,
                                bottom: '-60px',
                                animation: `floatUp ${balloon.speed}s linear, sway ${balloon.sway}s ease-in-out infinite`,
                                width: `${balloon.size}px`,
                                height: `${Math.round(balloon.size * 1.25)}px`,
                                transformOrigin: 'center',
                                filter: 'drop-shadow(0 12px 10px rgba(0,0,0,0.12))',
                            }}
                        >
                            <div
                                className="relative w-full h-full rounded-full"
                                style={{
                                    background: `radial-gradient(circle at 30% 30%, #FFFFFFAA, ${balloon.color})`,
                                    borderRadius: '45% 45% 40% 40% / 55% 55% 45% 45%',
                                }}
                            >
                                <div
                                    className="absolute left-1/2 -translate-x-1/2 bottom-[-18px] w-[6px] h-[20px] bg-gradient-to-b from-gray-300 to-gray-400"
                                    style={{ borderRadius: '0 0 8px 8px' }}
                                ></div>
                                <div className="absolute inset-0 flex items-center justify-center text-2xl">
                                    {balloon.face}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Instructions */}
                <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">📋 কিভাবে খেলবেন</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-4xl mb-2">👆</div>
                            <h4 className="font-semibold text-gray-800 mb-2">১. ক্লিক করুন</h4>
                            <p className="text-sm text-gray-600">উড়ন্ত বেলুনে ক্লিক করুন</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-2">⚡</div>
                            <h4 className="font-semibold text-gray-800 mb-2">২. দ্রুত হন</h4>
                            <p className="text-sm text-gray-600">বেলুন উপরে যাওয়ার আগে ফাটান</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-2">🎯</div>
                            <h4 className="font-semibold text-gray-800 mb-2">৩. স্কোর করুন</h4>
                            <p className="text-sm text-gray-600">প্রতিটি বেলুনে ১ পয়েন্ট</p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes floatUp {
                    from {
                        bottom: -60px;
                    }
                    to {
                        bottom: 100%;
                    }
                }

                @keyframes sway {
                    0% { transform: translateX(0px); }
                    50% { transform: translateX(18px); }
                    100% { transform: translateX(-18px); }
                }
            `}</style>
        </div>
    );
};

export default PopTheBalloon;
