import { useState } from 'react'
import Timer from './components/Timer'
import './styles/global.scss'

function App() {
  const [agendaItems, setAgendaItems] = useState<
    { topic: string; minutes: number; seconds: number }[]
  >([])
  const [timers, setTimers] = useState<{ topic: string; time: number }[]>([])

  const addAgendaItem = () => {
    setAgendaItems([...agendaItems, { topic: '', minutes: 0, seconds: 1 }]) // デフォルトは 00:01
  }

  const updateAgendaItem = (index: number, field: string, value: number) => {
    const newAgenda = [...agendaItems]
    if (field === 'topic') {
      newAgenda[index].topic = value as unknown as string
    } else if (field === 'minutes') {
      newAgenda[index].minutes = Math.max(0, value) // 負の値を防ぐ
    } else if (field === 'seconds') {
      newAgenda[index].seconds = Math.min(59, Math.max(0, value)) // 0~59 に制限
    }
    setAgendaItems(newAgenda)
  }

  const removeAgendaItem = (index: number) => {
    setAgendaItems(agendaItems.filter((_, i) => i !== index))
  }

  const generateTimers = () => {
    const convertedTimers = agendaItems.map((item) => ({
      topic: item.topic,
      time: item.minutes * 60 + item.seconds, // 分・秒を「秒数」に変換
    }))
    setTimers(convertedTimers)
  }

  return (
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
                updateAgendaItem(
                  index,
                  'topic',
                  e.target.value as unknown as number
                )
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
          <Timer key={index} topic={item.topic} initialTime={item.time} />
        ))}
      </div>
    </div>
  )
}

export default App
