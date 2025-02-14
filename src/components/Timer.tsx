import { useState, useEffect } from 'react'
import './Timer.scss'

interface TimerProps {
  topic: string
  initialTime: number // 秒単位
}

const Timer: React.FC<TimerProps> = ({ topic, initialTime }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)

  // オーディオの準備
  const alarmSound = new Audio('/audio/alarm.mp3')

  // タブのタイトルを更新する関数
  const updateDocumentTitle = (title: string) => {
    document.title = title
  }

  // ブラウザ通知を送る関数
  const sendNotification = () => {
    if (Notification.permission === 'granted') {
      const notification = new Notification('タイマー終了', {
        body: `${topic} の時間が終了しました！`,
        icon: '/icon.png',
      })

      // 通知をクリックしたらウィンドウをフォーカス
      notification.onclick = () => {
        window.focus()
        updateDocumentTitle('ミーティングタイマー') // 元のタイトルに戻す
      }
    }
  }

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
      alarmSound.play() // 音を再生
      sendNotification() // 通知を送る
      updateDocumentTitle('⏳ タイマー終了！') // タブのタイトルを変更
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
    return () => updateDocumentTitle('ミーティングタイマー')
  }, [])

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
    </div>
  )
}

export default Timer
