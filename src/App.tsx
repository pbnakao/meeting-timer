import { useState, useEffect } from 'react'
import Timer from './components/Timer'
import History from './components/History'
import './styles/global.scss'

// ローカルストレージ用のキー
const STORAGE_KEY = 'agenda-timer-data'
const HISTORY_KEY = 'agenda-timer-history'

// 履歴の型
interface HistoryItem {
  timestamp: string
  action: string
}

function App() {
  // 初期表示時のタブ名
  useEffect(() => {
    document.title = 'アジェンダタイマー'
  }, [])

  // アジェンダ関連
  const [agendaItems, setAgendaItems] = useState<
    { topic: string; minutes: number; seconds: number }[]
  >([])
  const [timers, setTimers] = useState<{ topic: string; time: number }[]>([])

  // 履歴を全体管理
  const [history, setHistory] = useState<HistoryItem[]>([])

  // ======================
  // アジェンダ保存・復元
  // ======================

  // 1️⃣ ローカルストレージからデータを読み込む
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      setAgendaItems(JSON.parse(savedData))
    }

    // 履歴も読み込み
    const savedHistory = localStorage.getItem(HISTORY_KEY)
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  // 2️⃣ データをローカルストレージに保存
  const saveToLocalStorage = (data: typeof agendaItems) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  // 履歴を保存
  const saveHistoryToLocalStorage = (newHistory: HistoryItem[]) => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
  }

  // 履歴を追加
  const addHistory = (action: string) => {
    const entry: HistoryItem = {
      timestamp: new Date().toLocaleTimeString(),
      action,
    }
    const newHistory = [entry, ...history.slice(0, 24)] // 最新25件を保持
    setHistory(newHistory)
    saveHistoryToLocalStorage(newHistory)
  }

  // 🌟 履歴をクリア
  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem(HISTORY_KEY) // ローカルストレージから履歴を削除
  }

  // ======================
  // アジェンダ項目の操作
  // ======================

  const addAgendaItem = () => {
    const newAgenda = [...agendaItems, { topic: '', minutes: 0, seconds: 1 }]
    setAgendaItems(newAgenda)
    saveToLocalStorage(newAgenda)
  }

  const updateAgendaItem = (
    index: number,
    field: string,
    value: number | string
  ) => {
    const newAgenda = [...agendaItems]
    if (field === 'topic') {
      newAgenda[index].topic = value as string
    } else if (field === 'minutes') {
      newAgenda[index].minutes = Math.max(0, value as number)
    } else if (field === 'seconds') {
      newAgenda[index].seconds = Math.min(59, Math.max(0, value as number))
    }
    setAgendaItems(newAgenda)
    saveToLocalStorage(newAgenda)
  }

  const removeAgendaItem = (index: number) => {
    const newAgenda = agendaItems.filter((_, i) => i !== index)
    setAgendaItems(newAgenda)
    saveToLocalStorage(newAgenda)
  }

  const generateTimers = () => {
    const convertedTimers = agendaItems.map((item) => ({
      topic: item.topic,
      time: item.minutes * 60 + item.seconds,
    }))
    setTimers(convertedTimers)
  }

  return (
    <div className="app-layout">
      {/* 左側: アジェンダ管理 & タイマー生成 */}
      <div className="agenda-container">
        <h2>アジェンダ入力</h2>
        <div id="agenda-list">
          {agendaItems.map((item, index) => (
            <div key={index} className="agenda-item">
              <input
                type="text"
                placeholder="トピック名"
                value={item.topic}
                onChange={(e) =>
                  updateAgendaItem(index, 'topic', e.target.value)
                }
              />
              <input
                type="number"
                placeholder="分"
                min="0"
                value={item.minutes}
                onChange={(e) =>
                  updateAgendaItem(index, 'minutes', Number(e.target.value))
                }
              />
              <input
                type="number"
                placeholder="秒"
                min="0"
                max="59"
                value={item.seconds}
                onChange={(e) =>
                  updateAgendaItem(index, 'seconds', Number(e.target.value))
                }
              />
              <button onClick={() => removeAgendaItem(index)}>削除</button>
            </div>
          ))}
        </div>
        <button onClick={addAgendaItem}>アジェンダ追加</button>
        <button onClick={generateTimers}>タイマー生成</button>

        <h2>タイマー一覧</h2>
        <div id="timer-list" className="timer-list">
          {timers.map((item, index) => (
            <Timer
              key={index}
              topic={item.topic}
              initialTime={item.time}
              onAddHistory={addHistory}
            />
          ))}
        </div>
      </div>

      <div className="history-panel">
        <History history={history} />
        <button onClick={clearHistory} className="clear-history-btn">
          操作履歴をクリア
        </button>
      </div>
    </div>
  )
}

export default App
