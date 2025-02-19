import React, { useState } from 'react'
import './DraggablePanel.scss'

interface DraggablePanelProps {
  children: React.ReactNode
}

const DraggablePanel: React.FC<DraggablePanelProps> = ({ children }) => {
  const [position, setPosition] = useState({ x: 20, y: 20 }) // 初期位置
  const [isDragging, setIsDragging] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  // === マウス操作 ===
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // === タッチ操作 ===
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0]
    setIsDragging(true)
    setOffset({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    })
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const touch = e.touches[0]
    setPosition({
      x: touch.clientX - offset.x,
      y: touch.clientY - offset.y,
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  return (
    <div
      className="draggable-panel"
      style={{ left: position.x, top: position.y }}
      // PC向けイベント
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      // モバイル向けイベント (パネル全体で受け取る)
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ドラッグ開始領域 */}
      <div
        className="drag-header"
        // PC
        onMouseDown={handleMouseDown}
        // モバイル
        onTouchStart={handleTouchStart}
      >
        <span className="drag-handle">≡</span>
      </div>
      <div className="content">{children}</div>
    </div>
  )
}

export default DraggablePanel
