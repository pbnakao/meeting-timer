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
  // 🌟 延長累計（秒単位）
  const [extendedTime, setExtendedTime] = useState(0)

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

      // タイマー終了時に合計延長をログ
      const totalExtendedMin = Math.floor(extendedTime / 60)
      onAddHistory(`タイマー終了 (${topic}): 合計 ${totalExtendedMin}分 延長`)

      document.title = '⏳ タイマー終了！'
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isRunning, timeLeft])

  // 時間表示フォーマット
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${min}:${sec < 10 ? '0' : ''}${sec}`
  }

  // 延長ボタン → 履歴書かない、累計延長だけ更新
  const extendTime = (seconds: number) => {
    setTimeLeft((prev) => prev + seconds)
    setExtendedTime((prev) => prev + seconds)
  }

  // リセット (初期状態に戻す & 合計延長をログ)
  const handleReset = () => {
    // リセット前に合計延長をログ
    const totalExtendedMin = Math.floor(extendedTime / 60)
    onAddHistory(`リセット (${topic}): 合計 ${totalExtendedMin}分 延長`)

    setTimeLeft(initialTime)
    setExtendedTime(0)
  }

  // 0秒リセット (強制終了 & 合計延長をログ)
  const resetToZero = () => {
    setIsManuallyReset(true)
    setTimeLeft(0)
    setIsRunning(false)

    const totalExtendedMin = Math.floor(extendedTime / 60)
    onAddHistory(`0秒リセット (${topic}): 合計 ${totalExtendedMin}分 延長`)

    // 次回カウントダウンでアラームが鳴らないよう少し待つ
    setTimeout(() => setIsManuallyReset(false), 1000)
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
        <button onClick={() => handleReset()}>リセット</button>
        <button onClick={() => resetToZero()}>0秒にリセット</button>
        <button onClick={() => extendTime(60)}>+1分</button>
        <button onClick={() => extendTime(300)}>+5分</button>
      </div>
    </div>
  )
}
export default Timer
