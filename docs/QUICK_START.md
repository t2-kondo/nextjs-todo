# 📚 開発者向けクイックスタートガイド

本ガイドは、Phase 1（マルチユーザー対応）の実装を開始するための具体的な手順を提供します。

---

## 前提条件

### 必要な環境
- Node.js 20.x以上
- npm 10.x以上
- Git
- PostgreSQL 16.x（ローカル開発用）
- VSCode（推奨エディタ）

### 推奨VSCode拡張機能
- Prisma
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GitLens

---

## Phase 1 キックオフ：環境構築

### Step 1: リポジトリの準備

```bash
# 現在のブランチから新しい作業ブランチを作成
git checkout -b feature/phase1-multiuser

# 開発用ディレクトリ構造の確認
tree -L 2 -I node_modules
```

### Step 2: 依存関係の追加

```bash
# 認証関連
npm install next-auth@beta @auth/prisma-adapter bcrypt
npm install -D @types/bcrypt

# PostgreSQL関連
npm install pg
npm install -D @types/pg

# バリデーション
npm install zod

# メール送信（後で使用）
npm install resend

# 状態管理
npm install zustand

# UI コンポーネント（オプション）
npm install @radix-ui/react-dropdown-menu @radix-ui/react-dialog
npm install class-variance-authority clsx tailwind-merge

# テスト関連
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test
```

### Step 3: 環境変数の設定

`.env.local` ファイルを作成：

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nextjs_todo_dev?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-generate-with-openssl"
# 生成: openssl rand -base64 32

# Email (Resend) - 後で設定
# RESEND_API_KEY="re_xxxxxxxxxxxx"

# OAuth Providers (後で設定)
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
# GITHUB_CLIENT_ID=""
# GITHUB_CLIENT_SECRET=""
```

`.env.test` ファイルを作成（テスト用）：

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/nextjs_todo_test?schema=public"
```

### Step 4: Docker Compose でPostgreSQL起動

`docker-compose.yml` を作成：

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: nextjs-todo-db
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: nextjs_todo_dev
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  postgres_test:
    image: postgres:16-alpine
    container_name: nextjs-todo-db-test
    ports:
      - "5433:5432"
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: nextjs_todo_test
    restart: unless-stopped

volumes:
  postgres_data:
```

起動：

```bash
docker-compose up -d
```

---

## Prisma Schema の更新

### Step 5: マルチユーザー対応のスキーマ設計

`prisma/schema.prisma` を更新：

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ユーザーモデル
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  passwordHash  String?
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // リレーション
  accounts      Account[]
  sessions      Session[]
  workspaces    WorkspaceMember[]
  createdTodos  Todo[]              @relation("TodoCreator")
  assignedTodos Todo[]              @relation("TodoAssignee")

  @@map("users")
}

// OAuth アカウント (NextAuth)
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

// セッション (NextAuth)
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

// メール確認トークン (NextAuth)
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// ワークスペース
model Workspace {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  ownerId   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // リレーション
  members WorkspaceMember[]
  todos   Todo[]

  @@map("workspaces")
}

// ワークスペースメンバー
model WorkspaceMember {
  id          String           @id @default(cuid())
  workspaceId String
  userId      String
  role        WorkspaceRole    @default(MEMBER)
  joinedAt    DateTime         @default(now())

  // リレーション
  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, userId])
  @@map("workspace_members")
}

enum WorkspaceRole {
  OWNER
  ADMIN
  MEMBER
}

// Todo（拡張版）
model Todo {
  id          String    @id @default(cuid())
  text        String
  completed   Boolean   @default(false)
  priority    Priority  @default(MEDIUM)
  dueDate     DateTime?
  workspaceId String
  createdById String
  assigneeId  String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // リレーション
  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  createdBy User      @relation("TodoCreator", fields: [createdById], references: [id])
  assignee  User?     @relation("TodoAssignee", fields: [assigneeId], references: [id])

  @@index([workspaceId])
  @@index([createdById])
  @@index([assigneeId])
  @@map("todos")
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

### Step 6: マイグレーション実行

```bash
# 既存のSQLiteデータをバックアップ（必要に応じて）
cp prisma/dev.db prisma/dev.db.backup

# Prismaクライアント生成
npx prisma generate

# マイグレーション作成・実行
npx prisma migrate dev --name init_multiuser

# Prisma Studio で確認
npx prisma studio
```

---

## NextAuth.js セットアップ

### Step 7: 認証設定ファイル

`lib/auth.ts` を作成：

```typescript
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcrypt";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid credentials");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        return user;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || ""
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
};
```

`app/api/auth/[...nextauth]/route.ts` を作成：

```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

---

## 開発ワークフロー

### Step 8: ブランチ戦略

```bash
# 機能ごとに細かくブランチを切る
git checkout -b feature/auth-setup
git checkout -b feature/workspace-crud
git checkout -b feature/todo-multiuser
git checkout -b feature/ui-components

# 実装後、Phase 1ブランチにマージ
git checkout feature/phase1-multiuser
git merge feature/auth-setup
```

### Step 9: 開発サーバー起動

```bash
# 開発サーバー
npm run dev

# 別ターミナルでPrisma Studio
npm run db:studio

# 型チェック
npx tsc --noEmit

# Lint
npm run lint
```

---

## テストの書き方

### Step 10: Vitestセットアップ

`vitest.config.ts` を作成：

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

`vitest.setup.ts` を作成：

```typescript
import '@testing-library/jest-dom';
```

### Step 11: サンプルテスト

`app/api/todos/__tests__/route.test.ts` を作成：

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { GET, POST } from '../route';
import { prisma } from '@/lib/prisma';

describe('/api/todos', () => {
  beforeEach(async () => {
    // テストデータクリーンアップ
    await prisma.todo.deleteMany();
  });

  it('should return empty array initially', async () => {
    const request = new Request('http://localhost:3000/api/todos');
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });

  // 他のテストケース...
});
```

テスト実行：

```bash
npm run test
```

---

## デバッグとトラブルシューティング

### よくある問題

#### 1. Prisma接続エラー
```bash
# データベースが起動しているか確認
docker ps

# 接続テスト
npx prisma db push
```

#### 2. TypeScript型エラー
```bash
# Prismaクライアント再生成
npx prisma generate

# node_modules削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

#### 3. NextAuth動作しない
- `.env.local`の`NEXTAUTH_SECRET`が設定されているか確認
- `NEXTAUTH_URL`が正しいか確認（本番環境では実際のドメイン）

---

## 次のステップ

Phase 1の実装が完了したら：

1. ✅ コードレビュー依頼
2. ✅ E2Eテスト実行（Playwright）
3. ✅ パフォーマンステスト（Lighthouse, k6）
4. ✅ セキュリティ監査（OWASP Top 10チェック）
5. ✅ ステージング環境デプロイ
6. ✅ ベータユーザーテスト

詳細は [Phase 1 Roadmap](PHASE1_ROADMAP.md) を参照。

---

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vitest](https://vitest.dev)
- [Playwright](https://playwright.dev)

---

**質問・問題があれば：**
- GitHub Issuesに投稿
- Slackチャンネル #dev-phase1
- 毎週金曜日の開発ミーティング

Happy Coding! 🚀
