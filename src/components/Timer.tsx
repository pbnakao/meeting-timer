import { useState, useEffect } from 'react'
import './Timer.scss'

interface TimerProps {
  topic: string
  initialTime: number // 秒単位
}

const Timer: React.FC<TimerProps> = ({ topic, initialTime }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)

  let timer: ReturnType<typeof setInterval> | null = null // 型を統一

  // オーディオの準備
  const alarmSound = new Audio('/audio/alarm.mp3')

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
      alarmSound.play()
      document.title = '⏳ タイマー終了！'
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isRunning, timeLeft])

  // 🌟 延長機能
  const extendTime = (seconds: number) => {
    setTimeLeft((prev) => prev + seconds)
  }

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${min}:${sec < 10 ? '0' : ''}${sec}`
  }

  return (
    <div className="timer">
      <h3>{topic}</h3>
      <p className="time-display">{formatTime(timeLeft)}</p>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? '一時停止' : '開始'}
      </button>
      <button onClick={() => setTimeLeft(initialTime)}>リセット</button>
      <button onClick={() => extendTime(60)}>+1分</button>
      <button onClick={() => extendTime(300)}>+5分</button>
    </div>
  )
}

export default Timer
