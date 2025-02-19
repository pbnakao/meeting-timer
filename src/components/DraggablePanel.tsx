import React, { useState, useRef } from 'react'
import './DraggablePanel.scss'

interface DraggablePanelProps {
  children: React.ReactNode
}

const DraggablePanel: React.FC<DraggablePanelProps> = ({ children }) => {
  const [position, setPosition] = useState({ x: 20, y: 20 }) // 初期位置
  const [isDragging, setIsDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const panelRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // ドラッグ開始
    setIsDragging(true)
    // クリック位置とパネル左上座標の差を記録
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    // マウスの移動に合わせて位置を更新
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div
      ref={panelRef}
      className="draggable-panel"
      style={{ left: position.x, top: position.y }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className="drag-header"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <span className="drag-handle">≡</span> {/* ドラッグ用アイコン */}
      </div>
      <div className="content">{children}</div>
    </div>
  )
}

export default DraggablePanel
