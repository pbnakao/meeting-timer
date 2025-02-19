import { useState, useEffect } from 'react'
import './Timer.scss'

interface TimerProps {
  topic: string
  initialTime: number // 秒単位
  onAddHistory: (action: string) => void // 親に履歴を追加してもらう
}

const Timer: React.FC<TimerProps> = ({ topic, initialTime, onAddHistory }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)
  const [isManuallyReset, setIsManuallyReset] = useState(false)

  let timer: ReturnType<typeof setInterval> | null = null // 型を統一

  // オーディオの準備
  const alarmSound = new Audio('/meeting-timer/audio/alarm.mp3')

  // タイマーのメインロジック
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && !isManuallyReset) {
      // 手動リセットじゃないときはアラーム
      setIsRunning(false)
      alarmSound.play()
      onAddHistory(`タイマー終了 (${topic})`)
      document.title = '⏳ タイマー終了！'
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isRunning, timeLeft])

  // 0秒リセット機能
  const resetToZero = () => {
    setIsManuallyReset(true)
    setTimeLeft(0)
    setIsRunning(false)
    setTimeout(() => setIsManuallyReset(false), 1000)
  }

  // 時間表示フォーマット
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${min}:${sec < 10 ? '0' : ''}${sec}`
  }

  return (
    <div className="timer">
      <h3>{topic}</h3>
      <p className="time-display">{formatTime(timeLeft)}</p>

      <div className="button-group">
        <button
          onClick={() => {
            setIsRunning(!isRunning)
            onAddHistory(
              isRunning ? `⏸ 一時停止 (${topic})` : `▶️ 開始 (${topic})`
            )
          }}
        >
          {isRunning ? '一時停止' : '開始'}
        </button>
        <button
          onClick={() => {
            setTimeLeft(initialTime)
            onAddHistory(`🔄 リセット (${topic})`)
          }}
        >
          リセット
        </button>
        <button
          onClick={() => {
            resetToZero()
            onAddHistory(`⏹ 0秒にリセット (${topic})`)
          }}
        >
          0秒にリセット
        </button>
        <button
          onClick={() => {
            setTimeLeft((prev) => prev + 60)
            onAddHistory(`➕ 1分追加 (${topic})`)
          }}
        >
          +1分
        </button>
        <button
          onClick={() => {
            setTimeLeft((prev) => prev + 300)
            onAddHistory(`➕ 5分追加 (${topic})`)
          }}
        >
          +5分
        </button>
      </div>
    </div>
  )
}

export default Timer
