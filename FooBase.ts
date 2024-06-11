import { Pool } from 'pg'

interface conditionTypes {
  column: string;
  value: (string | number)[];
}

interface databasePromise {
  data: any;
  message: any;
}

interface databaseConfig {
  host: string;
  user: string;
  port: number;
  password: string;
  database: string;
}

const databaseConfig  : databaseConfig = {
  host: process.env.HOST,
  user: process.env.USER,
  port: parseInt(process.env.PORT),
  password: process.env.PASSWORD,
  database:process.env.DATABASE
}

const db = new Pool(databaseConfig)

class FooBase {
  private errors          : string[] = [];
  private table           : string = '';
  public  selectField     : string = '';
  private insertField     : string = '';
  private updateField     : string = '';
  private condition       : conditionTypes = {column: '', value: []};
  private set             : string = '';
  public  finalSQL        : string = '';
  
  from(table: string): this {
    this.table = table
    return this
  }

  select(fields: string | string[]): this {
    let temp = 'select '
    if (typeof fields === 'string') {
      // if parameter is an actual string, return it immediately
      this.selectField = temp + fields
      return this
    }

    // if parameter is an array of strings
    let selection = ''
    for (let i = 0; i < fields.length; i++) {
      if (i === fields.length - 1) {
        selection += fields[i]
      } else {
        selection += `${fields[i]}, `
      }
    }

    this.selectField = temp + selection
    return this
  }

  insert(column: string | string[], value: any): this {
    this.insertField = 'insert into '

    if (typeof column === 'string') {
      this.condition.column = ` (${column}) values ($1)`
      this.condition.value.push(value)
      return this
    }

    let cols = '(', values = '('
    for (let i = 0; i < column.length; i++) {
      cols    += column[i]
      values  += `$${i + 1}`
      
      if (i !== column.length - 1) {
        cols    += ', '
        values  += ', '
      }
    }
    cols    += ')'
    values  += ')'

    this.condition.column = ` ${cols} values ${values}`
    this.condition.value  = value // TODO: sanitize

    return this
  }

  update(column: string | string[], value: any): this {
    this.updateField = 'update '

    if(typeof column === 'string') {
      this.set = ` set ${column} = $1`
      this.condition.value.push(value)
      return this
    }

    let temp = ' set '
    for (let i = 0; i < column.length; i++) {
      temp += `${column[i]} = $${i + 1}`
      if (i !== column.length - 1) temp += ', '

      this.condition.value.push(value[i])
    }

    this.set = temp

    return this
  }

  // For single where clause
  /*
    e.g. 
      eq('id', 1001) 
      expected: 
        where id = $1; 
        value    = 1001

    e.g. 
      eq('email', jtzuya@gmail.com)
      expected: 
        where email = $1; 
        value       = jtzuya@gmail.com
  */
  eq(column: string, value: string | number): this {
    this.condition.column += ` where ${column} = $${this.condition.value.length + 1}`
    this.condition.value.push(value)

    return this
  }

  // For multiple where clauses
  eqs(column: string[], value: (string | number)[]): this {
    let temp = ' where'

    for (let i = 0; i < column.length; i++) {
      temp += ` ${column[i]} = $${this.condition.value.length + 1}`
      
      this.condition.value.push(value[i]) // TODO: sanitize

      if (i !== column.length - 1) temp += ' and'
    }

    this.condition.column = temp
    // this.condition.value  = value

    return this
  }

  analyze(): this {
    let method = '', table = '', set = ''

    if (this.selectField !== '') {
      method  = this.selectField
      table   = ` from ${this.table}`
    }

    if (this.insertField !== '') {
      method  = this.insertField
      table   = this.table
    }

    if (this.updateField !== '') {
      method  = this.updateField
      table   = this.table
      set     = this.set
    }
        
    this.finalSQL = method + table + set + this.condition.column

    return this
  }

  async exec(): Promise<databasePromise> {
    this.analyze()
    let SQLScript = this.finalSQL
    let values    = this.condition.value
    this.reset()

    const executePromise = new Promise<{rows: any[]}>(function(resolve, reject) {
      db.query(SQLScript, values, function(error, results) {
        if(error) reject(new Error(`Error caught: ${error}`))
        resolve(results)
      })
    })

    try {
      const results = await executePromise
      const data = results.rows

      return {
        data: data,
        message: 'query executed',
      }
    } catch(error) {
      return {
        data: null,
        message: error
      }
    }
  }

  reset() {
    this.errors         = [];
    this.table          = '';
    this.selectField    = '';
    this.insertField    = '';
    this.updateField    = '';
    this.condition      = {column: '', value: []}
  }
}

export { FooBase }