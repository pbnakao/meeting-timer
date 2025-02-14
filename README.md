# アジェンダタイマー

## 概要

アジェンダタイマーは、会議の進行をスムーズにするためのシンプルなタイマーアプリケーションです。各トピックの所要時間を事前に設定し、時間経過とともに次のトピックへ切り替えやすくすることを目的としています。

## 特徴

- **アジェンダ入力**: トピック名と時間を手動で設定可能。
- **アジェンダ追加**: トピックを自由に追加・削除できる。
- **タイマー生成**: 設定したアジェンダをもとにタイマーリストを作成。
- **タイマー開始**: 各トピックのカウントダウン機能を搭載。
- **ローカルストレージ対応**（今後実装予定）: 入力したアジェンダを保存し、再利用できるようにする。

## 画面構成

1. **アジェンダ入力画面**
   - トピック名入力欄
   - 時間（分）入力欄
   - 「アジェンダ追加」ボタン
   - 「タイマー生成」ボタン
2. **タイマー一覧画面**
   - 各トピックのタイマー表示
   - 「開始」ボタンでカウントダウン開始

## 使い方

1. 必要なトピックと所要時間を入力する。
2. 「アジェンダ追加」ボタンでリストに追加する。
3. 「タイマー生成」ボタンでタイマー一覧を作成する。
4. 各トピックの「開始」ボタンを押すと、カウントダウンが始まる。

## 今後の開発予定

- **デザイン調整**: UI/UX の改善。
- **一時停止・リセット機能**: タイマーの制御を強化。
- **ローカルストレージ保存機能**: アジェンダを保存・復元可能に。
- **CSV ダウンロード機能**: 記録したアジェンダをエクスポートできるようにする。

## 開発環境

- HTML / CSS / JavaScript (Vanilla JS)
- フロントエンドのみ（シンプルな構成）

## ライセンス

このプロジェクトは MIT ライセンスのもとで公開されています。
