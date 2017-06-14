# goldie-bot

Data description 
### user
```
{
  id: '1',
  firstName: 'Marc',
  surname: 'Phillips'
}
```

### plant
```
{
  id: '1',
  name: 'Plant Under Earth'
}
```

### plantItem
```
{
  id: '1',
  plantId: '1',
  name: 'Pick'
}
```

### workOrder

```
{
  id: '1',
  number: 'SKU1234',
  plantItemId: '1',
  asignedUserId: '1',
  status: 'open'|'closed',
  startDate: '9:30 2/2/2017',
  completedDate: '9:32 2/2/2017', //24 hour clock time
  downTime: '9', //hours
  problemDescription: 'The pick was broken',
  historyNotes: 'Don't break it next time!'
}
```
