// api/sync-google-tasks.js
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

  const { accessToken } = req.body;
  if (!accessToken) {
    return res.status(400).json({ error: 'Missing accessToken' });
  }

  try {
    // 1. タスクリスト一覧を取得
    const listsRes = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    if (!listsRes.ok) {
      const errText = await listsRes.text();
      return res.status(listsRes.status).json({ error: 'Failed to fetch task lists', details: errText });
    }

    const listsData = await listsRes.json();
    const taskLists = listsData.items || [];

    let allTasks = [];

    // 2. 各タスクリストからタスクを取得
    for (const list of taskLists) {
      // 完了・未完了を含む全タスクを取得
      const tasksUrl = `https://tasks.googleapis.com/tasks/v1/lists/${list.id}/tasks?showCompleted=true&showHidden=true`;
      const tasksRes = await fetch(tasksUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        if (tasksData.items) {
          const mapped = tasksData.items.map(t => ({
            ...t,
            listName: list.title
          }));
          allTasks = allTasks.concat(mapped);
        }
      }
    }

    return res.status(200).json({ items: allTasks });
  } catch (error) {
    console.error('Error in sync-google-tasks API:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
