import './History.scss'

interface HistoryItem {
  timestamp: string
  action: string
}

function History({ history }: { history: HistoryItem[] }) {
  return (
    <div className="history-container">
      <h3>📜 操作履歴</h3>
      <ul>
        {history.map((item, idx) => (
          <li key={idx}>
            <span className="time">{item.timestamp}</span> - {item.action}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default History
