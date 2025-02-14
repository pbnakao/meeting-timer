import { useState } from 'react'
import './styles/global.scss'

function App() {
  const [agendaItems, setAgendaItems] = useState<
    { topic: string; time: number }[]
  >([])
  const [timers, setTimers] = useState<{ topic: string; time: number }[]>([])

  const addAgendaItem = () => {
    setAgendaItems([...agendaItems, { topic: '', time: 1 }])
  }

  const updateAgendaItem = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newAgenda = [...agendaItems]
    if (field === 'topic') newAgenda[index].topic = value as string
    if (field === 'time') newAgenda[index].time = Number(value)
    setAgendaItems(newAgenda)
  }

  const removeAgendaItem = (index: number) => {
    setAgendaItems(agendaItems.filter((_, i) => i !== index))
  }

  const generateTimers = () => {
    setTimers([...agendaItems])
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
              onChange={(e) => updateAgendaItem(index, 'topic', e.target.value)}
            />
            <input
              type="number"
              placeholder="時間(分)"
              min="1"
              value={item.time}
              onChange={(e) => updateAgendaItem(index, 'time', e.target.value)}
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
          <div key={index} className="timer-item">
            <strong>{item.topic}</strong> - {item.time}分
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
