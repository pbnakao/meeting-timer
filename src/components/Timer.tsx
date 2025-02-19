import { useState, useEffect } from 'react'
import './Timer.scss'

interface TimerProps {
  topic: string
  initialTime: number // 秒単位
}

const Timer: React.FC<TimerProps> = ({ topic, initialTime }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)
  const [isManuallyReset, setIsManuallyReset] = useState(false) // 🔥 手動リセットフラグを追加

  let timer: ReturnType<typeof setInterval> | null = null // 型を統一

  // オーディオの準備
  const alarmSound = new Audio('/meeting-timer/audio/alarm.mp3')

  // タブのタイトルを更新する関数
  const updateDocumentTitle = (title: string) => {
    document.title = title
  }

  // ブラウザ通知を送る関数
  const sendNotification = () => {
    if (Notification.permission === 'granted') {
      const notification = new Notification('タイマー終了', {
        body: `${topic} の時間が終了しました！`,
        icon: '/icon.png', // 任意のアイコン
      })
      // 通知をクリックしたらウィンドウをフォーカス
      notification.onclick = () => {
        window.focus()
        updateDocumentTitle('アジェンダタイマー')
      }
    }
  }

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && !isManuallyReset) {
      // 🔥 手動リセット時はアラームを鳴らさない
      setIsRunning(false)
      alarmSound.play()
      sendNotification()
      document.title = '⏳ タイマー終了！'
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isRunning, timeLeft])

  // 通知の許可をリクエスト
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log('通知の許可:', permission)
      })
    }

    // ページを開いたときにタイトルを元に戻す
    return () => updateDocumentTitle('アジェンダタイマー')
  }, [])

  // 🌟 延長機能
  const extendTime = (seconds: number) => {
    setTimeLeft((prev) => prev + seconds)
  }

  // 🌟 0秒リセット機能（アラームを鳴らさない）
  const resetToZero = () => {
    setIsManuallyReset(true) // 🔥 手動リセットしたことを記録
    setTimeLeft(0)
    setIsRunning(false) // タイマーも停止
    setTimeout(() => setIsManuallyReset(false), 1000) // 🔥 1秒後にフラグを戻す（次の通常動作に影響しないように）
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
      <button onClick={resetToZero}>⏹ 0秒にリセット</button>
      <button onClick={() => extendTime(60)}>+1分</button>
      <button onClick={() => extendTime(300)}>+5分</button>
    </div>
  )
}

export default Timer
