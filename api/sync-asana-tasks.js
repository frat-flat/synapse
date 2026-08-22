// api/sync-asana-tasks.js
export default async function handler(req, res) {
  // CORSヘッダーを設定
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { asanaToken, action, taskGid, completed } = req.body;
  if (!asanaToken) {
    return res.status(400).json({ error: 'Missing asanaToken' });
  }

  // 1. タスクの完了ステータス更新アクション
  if (action === 'update' && taskGid) {
    try {
      const updateRes = await fetch(`https://app.asana.com/api/1.0/tasks/${taskGid}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${asanaToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          data: { completed: !!completed }
        })
      });

      if (!updateRes.ok) {
        const errText = await updateRes.text();
        return res.status(updateRes.status).json({ error: 'Failed to update Asana task', details: errText });
      }

      const updatedData = await updateRes.json();
      return res.status(200).json(updatedData.data);
    } catch (error) {
      console.error('Error updating Asana task:', error);
      return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }

  try {
    // 2. 通常の同期：ユーザー情報 (自分自身) を取得してメールアドレスを検証可能にする
    const userRes = await fetch('https://app.asana.com/api/1.0/users/me', {
      headers: {
        'Authorization': `Bearer ${asanaToken}`,
        'Accept': 'application/json'
      }
    });

    if (!userRes.ok) {
      const errText = await userRes.text();
      return res.status(userRes.status).json({ error: 'Failed to fetch Asana user info', details: errText });
    }

    const userData = await userRes.json();
    const userEmail = userData.data ? userData.data.email : null;
    const userName = userData.data ? userData.data.name : 'Asana User';

    // 3. 担当しているタスク一覧を取得
    // 1回のリクエストで必要フィールドを取得するため opt_fields を指定
    const tasksUrl = 'https://app.asana.com/api/1.0/tasks?assignee=me&opt_fields=name,due_on,completed,notes';
    const tasksRes = await fetch(tasksUrl, {
      headers: {
        'Authorization': `Bearer ${asanaToken}`,
        'Accept': 'application/json'
      }
    });

    let allTasks = [];
    if (tasksRes.ok) {
      const tasksData = await tasksRes.json();
      allTasks = tasksData.data || [];
    } else {
      const errText = await tasksRes.text();
      console.error('Failed to fetch Asana tasks details:', errText);
    }

    return res.status(200).json({
      user: {
        email: userEmail,
        name: userName
      },
      items: allTasks
    });
  } catch (error) {
    console.error('Error in sync-asana-tasks API:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
