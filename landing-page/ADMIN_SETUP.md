# 后台管理系统上线配置

后台入口：`https://xwzn.netlify.app/admin`。入口不会显示在官网导航中，但仍由服务端登录保护。

## 1. 创建 Supabase 数据库

1. 在 Supabase 创建项目。
2. 打开 SQL Editor，执行 `supabase/schema.sql`。
3. 在 Project Settings → API 获取 Project URL 和 `service_role` key。

## 2. 配置 Netlify 环境变量

在 Netlify 站点的 Environment variables 中配置：

- `SUPABASE_URL`：Supabase Project URL
- `SUPABASE_SERVICE_ROLE_KEY`：Supabase `service_role` key
- `ADMIN_USERNAME`：管理员用户名
- `ADMIN_PASSWORD_HASH`：管理员密码的 SHA-256 值
- `ADMIN_SESSION_SECRET`：至少 32 位随机字符串，用于签发登录会话
- `PUSHDEER_KEY`：现有 PushDeer 推送 Key

在本机生成密码 SHA-256（命令只在本机计算，不会上传密码）：

```powershell
$value = Read-Host "输入后台密码" -AsSecureString
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($value)
$plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
$bytes = [Text.Encoding]::UTF8.GetBytes($plain)
[Convert]::ToHexString([Security.Cryptography.SHA256]::HashData($bytes)).ToLower()
[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
```

不要把密码、Hash、Supabase key 或 Token 写入代码或提交到 GitHub。

## 业务规则

- 官网咨询始终自动建立或匹配客户档案，并保存咨询记录。
- 只有选择“静态官网 / 个人落地页”套餐的咨询标记为可部署。
- 其他项目可以保存客户、项目、交付日期和完成状态。
- 线上后台不连接 GitHub 或 Netlify，也不执行代码提交或部署；这些操作统一在本机 Flet 部署工具中完成。
- 点击“确认交付”后开始计算 30 天免费管理期。
- 到期项目每日通过 PushDeer 提醒；人工下架满 30 天后每日提醒备份并删除 GitHub 代码。
- 删除仓库不会自动执行，必须由管理员人工二次确认。
