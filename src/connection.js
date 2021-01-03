const Database = require('better-sqlite3')

const StmtInsert = (row) => {
  const stmt = `(${row.join(',')})`
  console.log(stmt)
  return stmt
}

class Connect {
  constructor(dbPath) {
    this.database = new Database(dbPath)
  }

  getDatabase() {
    return this.database
  }

  getAllTableNames() {
    return this
      .getDatabase()
      .prepare('select name from sqlite_master where type = "table"')
  }

  getQuery(query, getter = '') {
    // 'SELECT * FROM users WHERE id = ?'
    return this
      .getDatabase()
      .prepare(query)
      .get(getter)
  }

  getTable(table) {
    return this
      .getDatabase()
      .prepare(`SELECT * FROM ${table}`)
      .all()
  }

  createTable(table, keys) {
    const tableKeys = Object
      .entries(keys)
      .map(e => `${e[0]} ${e[1]}`)
      .join(', ')

    return this
      .getDatabase()
      .prepare(`CREATE TABLE ${table} (${tableKeys})`)
      .run()
  }

  insertValues(table, values) {
    this
      .getDatabase()
      .prepare(`INSERT INTO ${table} VALUES ${
        values.map(sql => sql.toString() === '[object Object]' ?
        StmtInsert(Object.values(sql)) : StmtInsert(sql))})`)
      .run()
  }
}

module.exports = Connect
