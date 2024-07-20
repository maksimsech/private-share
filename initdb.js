db.createCollection('records')
db.records.createIndex({'expireAt': 1}, {expireAfterSeconds: 15})
