# 実装ロードマップ：Phase 1 詳細計画

## Phase 1概要（2026年Q1 - 3ヶ月）

**目標：** 現行シングルユーザーTodoアプリをマルチユーザー対応のWebアプリケーションに進化させる

**チーム構成：** 5名
- フルスタックエンジニア × 3
- プロダクトマネージャー × 1
- UI/UXデザイナー × 1

**予算：** 1,500万円

---

## Week 1-2: 環境構築と設計

### タスク一覧

#### 開発環境整備
- [ ] GitHubリポジトリの構造化（monorepo検討）
- [ ] CI/CD基盤構築（GitHub Actions）
  - Lint/Typecheck
  - Unit Test
  - Build verification
  - Preview deployment（Vercel）
- [ ] 開発用Docker環境（PostgreSQL + Redis）
- [ ] ESLint/Prettierルール統一
- [ ] Husky（pre-commit hooks）設定

#### データベース設計
- [ ] ER図作成
  ```
  User (ユーザー)
  ├── id: UUID
  ├── email: String (unique)
  ├── name: String
  ├── passwordHash: String
  ├── emailVerified: DateTime?
  └── createdAt: DateTime

  Workspace (ワークスペース)
  ├── id: UUID
  ├── name: String
  ├── slug: String (unique)
  ├── ownerId: UUID → User
  └── createdAt: DateTime

  WorkspaceMember (メンバーシップ)
  ├── id: UUID
  ├── workspaceId: UUID → Workspace
  ├── userId: UUID → User
  ├── role: Enum (OWNER, ADMIN, MEMBER)
  └── joinedAt: DateTime

  Todo (タスク) - 拡張
  ├── id: UUID (Int → UUID変更)
  ├── text: String
  ├── completed: Boolean
  ├── workspaceId: UUID → Workspace
  ├── assigneeId: UUID? → User
  ├── createdById: UUID → User
  ├── priority: Enum (LOW, MEDIUM, HIGH)
  ├── dueDate: DateTime?
  ├── createdAt: DateTime
  └── updatedAt: DateTime
  ```

- [ ] Prisma Schema更新
- [ ] Migration戦略決定（既存データ移行）

#### 技術選定・検証
- [ ] 認証ライブラリ選定
  - NextAuth.js vs. Clerk vs. Supabase Auth
  - 評価基準：コスト、拡張性、開発速度
- [ ] PostgreSQL Managed Service選定
  - Supabase vs. Neon vs. AWS RDS
- [ ] 状態管理ライブラリ選定
  - Zustand vs. Jotai vs. Redux Toolkit

#### UI/UXデザイン
- [ ] ワイヤーフレーム作成
  - ログイン/サインアップ画面
  - ワークスペース選択画面
  - 招待フロー
  - 設定画面
- [ ] デザインシステム定義
  - カラーパレット
  - タイポグラフィ
  - コンポーネントライブラリ（shadcn/ui導入検討）

---

## Week 3-4: 認証システム実装

### タスク一覧

#### バックエンド
- [ ] NextAuth.js設定
  - Email/Password provider
  - OAuth provider（Google、GitHub）
  - JWT戦略
  - Session管理
- [ ] User APIエンドポイント
  - `POST /api/auth/signup` - ユーザー登録
  - `POST /api/auth/signin` - ログイン
  - `GET /api/auth/me` - 現在のユーザー情報
  - `PATCH /api/auth/me` - プロフィール更新
  - `POST /api/auth/reset-password` - パスワードリセット
- [ ] メール送信基盤
  - SendGrid or Resend統合
  - 確認メールテンプレート
  - パスワードリセットメール

#### フロントエンド
- [ ] 認証UIコンポーネント
  - LoginForm
  - SignupForm
  - ResetPasswordForm
  - EmailVerificationNotice
- [ ] 認証状態管理
  - useAuth hook
  - Protected Route wrapper
  - Session refresh logic
- [ ] エラーハンドリング
  - フォームバリデーション
  - APIエラー表示

#### セキュリティ
- [ ] パスワードハッシュ（bcrypt）
- [ ] CSRF対策（Next.js標準）
- [ ] レート制限（API）
  - ログイン試行：5回/5分
  - サインアップ：3回/時間
- [ ] 入力サニタイゼーション

---

## Week 5-6: ワークスペース機能実装

### タスク一覧

#### データベース
- [ ] Workspace, WorkspaceMember テーブル作成
- [ ] Multi-tenancy設定
  - Row Level Security（RLS）検討
  - Prismaフィルタリング戦略

#### APIエンドポイント
- [ ] Workspace CRUD
  - `POST /api/workspaces` - 作成
  - `GET /api/workspaces` - 一覧取得
  - `GET /api/workspaces/[id]` - 詳細取得
  - `PATCH /api/workspaces/[id]` - 更新
  - `DELETE /api/workspaces/[id]` - 削除
- [ ] Member管理
  - `POST /api/workspaces/[id]/members` - 招待
  - `GET /api/workspaces/[id]/members` - メンバー一覧
  - `PATCH /api/workspaces/[id]/members/[userId]` - ロール変更
  - `DELETE /api/workspaces/[id]/members/[userId]` - 削除

#### 招待システム
- [ ] 招待トークン生成（JWT）
- [ ] 招待メール送信
- [ ] 招待受諾フロー
- [ ] 招待リンク有効期限（7日間）

#### UI実装
- [ ] ワークスペース選択画面
- [ ] ワークスペース作成モーダル
- [ ] メンバー管理画面
- [ ] 招待フォーム
- [ ] ロール選択UI（OWNER, ADMIN, MEMBER）

#### 権限制御
- [ ] ミドルウェア実装
  - `requireAuth` - 認証必須
  - `requireWorkspace` - ワークスペースアクセス確認
  - `requireRole` - ロール確認
- [ ] フロントエンド権限チェック
  - 条件付きレンダリング
  - 操作制限

---

## Week 7-8: Todo機能マルチユーザー対応

### タスク一覧

#### データモデル拡張
- [ ] Todo Schema更新
  - workspaceId追加
  - assigneeId追加
  - createdById追加
  - priority追加
  - dueDate追加
- [ ] 既存データマイグレーション
  - デフォルトワークスペース作成
  - 既存Todoを紐付け

#### APIリファクタリング
- [ ] Todo API更新
  - `GET /api/todos` - ワークスペースフィルタリング
  - `POST /api/todos` - 作成者記録
  - `PATCH /api/todos/[id]` - 担当者変更対応
  - 権限チェック追加（ワークスペースメンバーのみ操作可）

#### UI強化
- [ ] Todo表示拡張
  - 担当者アバター表示
  - 優先度ラベル
  - 期日表示
  - 作成者情報
- [ ] Todo編集機能
  - 担当者選択ドロップダウン
  - 優先度選択
  - 日付ピッカー（期日設定）
- [ ] フィルター・ソート
  - 担当者でフィルター
  - 優先度でソート
  - 期日でソート
  - 検索機能

#### レスポンシブ対応
- [ ] モバイルUI最適化
- [ ] タブレットレイアウト
- [ ] デスクトップ多カラムレイアウト

---

## Week 9-10: テストとドキュメント

### タスク一覧

#### テスト実装
- [ ] Unit Test
  - ユーティリティ関数
  - API Route Handlers
  - バリデーションロジック
- [ ] Integration Test
  - 認証フロー
  - ワークスペース作成〜メンバー追加
  - Todo CRUD（権限付き）
- [ ] E2E Test（Playwright）
  - ユーザー登録〜ログイン
  - ワークスペース作成
  - Todo作成〜完了
  - メンバー招待
- [ ] テストカバレッジ目標：70%以上

#### ドキュメント作成
- [ ] README更新
  - 新機能説明
  - セットアップ手順
  - 環境変数一覧
- [ ] API仕様書（OpenAPI）
  - Swagger UI設定
  - 全エンドポイント定義
- [ ] ユーザーガイド
  - ワークスペース管理
  - メンバー招待方法
  - 権限体系説明

#### パフォーマンス最適化
- [ ] データベースインデックス最適化
- [ ] N+1クエリ解消
- [ ] 画像最適化（Next.js Image）
- [ ] バンドルサイズ削減

---

## Week 11-12: デプロイと本番移行

### タスク一覧

#### 本番環境構築
- [ ] PostgreSQL本番DB構築
  - Backup設定
  - レプリケーション設定
- [ ] 環境変数管理
  - Vercel環境変数設定
  - Secrets管理
- [ ] ドメイン設定
  - SSL証明書
  - DNS設定

#### セキュリティ監査
- [ ] OWASP Top 10チェック
  - SQLインジェクション
  - XSS
  - CSRF
  - 認証・認可の脆弱性
- [ ] 脆弱性スキャン（npm audit）
- [ ] 依存関係更新

#### 監視・アラート
- [ ] Vercel Analytics設定
- [ ] Sentry（エラートラッキング）
- [ ] Uptime監視（UptimeRobot）
- [ ] Slack通知設定

#### データ移行計画
- [ ] 既存ユーザーデータ移行スクリプト
- [ ] ロールバックプラン
- [ ] 段階的ロールアウト計画

#### 負荷テスト
- [ ] k6によるロードテスト
  - 100並行ユーザー
  - 1000リクエスト/分
- [ ] レスポンスタイム測定
  - p50, p95, p99
  - 目標：p95 < 200ms

#### ベータテスト
- [ ] ベータユーザー募集（10-20名）
- [ ] フィードバック収集
- [ ] クリティカルバグ修正

---

## 成果物チェックリスト

### 機能要件
- [ ] ユーザー登録・ログイン
- [ ] メール認証
- [ ] パスワードリセット
- [ ] OAuth認証（Google, GitHub）
- [ ] ワークスペース作成・削除
- [ ] メンバー招待・削除
- [ ] ロール管理（OWNER, ADMIN, MEMBER）
- [ ] Todo作成・編集・削除（担当者、優先度、期日付き）
- [ ] Todo一覧表示（フィルター、ソート、検索）
- [ ] レスポンシブUI

### 非機能要件
- [ ] PostgreSQL本番運用
- [ ] p95レスポンスタイム < 200ms
- [ ] テストカバレッジ > 70%
- [ ] モバイル対応
- [ ] OWASP Top 10対策
- [ ] CI/CD自動化
- [ ] エラートラッキング
- [ ] Uptime監視

### ドキュメント
- [ ] README（セットアップ手順）
- [ ] API仕様書（OpenAPI）
- [ ] ユーザーガイド
- [ ] アーキテクチャ図

---

## リスクと対策

| リスク | 影響 | 確率 | 対策 |
|--------|------|------|------|
| PostgreSQL移行の遅延 | 高 | 中 | Week 1でPoC実施、早期検証 |
| 認証ライブラリの学習コスト | 中 | 高 | NextAuth.js選定（実績多数） |
| E2Eテストの不安定性 | 中 | 中 | Retry戦略、十分な待機時間 |
| パフォーマンス未達 | 高 | 低 | Week 9で早期測定、最適化余地確保 |
| スコープクリープ | 高 | 中 | MVPに集中、Phase 2に先送り |

---

## Phase 1完了判定基準

以下すべてを満たした時点でPhase 1完了とする：

1. **機能完成度：** 上記「機能要件」すべて実装完了
2. **品質基準：** テストカバレッジ70%以上、クリティカルバグゼロ
3. **パフォーマンス：** p95レスポンスタイム200ms以下
4. **ドキュメント：** README、API仕様書、ユーザーガイド完成
5. **本番稼働：** 10名以上のベータユーザーで1週間以上安定稼働

---

**計画作成日：** 2026年1月1日  
**計画責任者：** プロダクトマネージャー  
**次回レビュー：** Week 4終了時（中間レビュー）
