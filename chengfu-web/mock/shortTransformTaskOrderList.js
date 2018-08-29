import { getUrlParams } from './utils';


function listDataSource({ page, size }) {
  const p = Number(page);
  const s = Number(size);
  const data = {
    content: [],
    totalElements: 100,
    number: p,
    size: s,
  };

  for (let i = p * s; i < (p + 1) * s; i += 1) {
    data.content.push({
      id: i + 1,
      shipName: `天使号${i}`,
      explain: '示例任务来源说明',
      contractCode: `21u312SAD${i}`,
      contractNumber: Math.ceil(Math.random() * 10),
      createdDate: new Date(`2017-07-${Math.floor(i / 2) + 10}`),
      terminationDate: new Date(`2017-07-${Math.floor(i / 2) + 10}`),
      completedDate: new Date(`2017-07-${Math.floor(i / 2) + 10}`),
      status: ['pending', 'termination', 'completed', 'invalid'][i % 4],
      type: ['load', 'unload', 'other', 'shipPing'][i % 4],
      port: {
        name: '青岛港',
        id: i + 1,
      },
    });
  }

  return data;
}

function getList(req, res) {
  const params = getUrlParams(req.url);

  const cards = listDataSource(params);

  res.json(cards);
}

export {
  getList,
};
