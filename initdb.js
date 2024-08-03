db.createCollection('records')
db.records.createIndex({'expireAt': 1}, {expireAfterSeconds: 15})
db.createCollection('one-time-records')
db['one-time-records'].createIndex({'expireAt': 1}, {expireAfterSeconds: 15})
