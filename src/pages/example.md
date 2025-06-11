    import * as vscode from 'vscode';

    export function activate(context: vscode.ExtensionContext) {
    // 注册一个聊天参与者，监听 @sql 命令
    const chatParticipant = vscode.chat.createChatParticipant('sql', async (message: vscode.ChatMessage) => {
        if (message.text.startsWith('@sql')) {
        const command = message.text.substring(5).trim(); // 提取 @sql 后的命令
        const response = await callMcpServer(command); // 调用 MCP 服务器
        return new vscode.ChatMessage(response); // 返回响应给用户
        }
        return null; // 如果不是 @sql 命令，则不处理
    });
    context.subscriptions.push(chatParticipant);
    }

    // 调用 MCP 服务器的函数
    async function callMcpServer(command: string): Promise<string> {
    const fetch = require('node-fetch');
    const response = await fetch('http://localhost:3000/mcp', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
    });
    const data = await response.json();
    return data.response;
    }