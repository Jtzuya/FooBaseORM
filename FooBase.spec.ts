import { FooBase } from "./FooBase";

describe("SQL instructions", () => {
  it("should concatenate strings correctly", () => {
    const orm = new FooBase()
    expect(orm.select('email').selectField).toEqual('select email')
  })
    
  it("should concatenate an array of strings correctly", () => {
    const orm = new FooBase()
    expect(orm.select(['email', 'password', 'id']).selectField).toEqual('select email, password, id')
  })

  it("should concatenate to create a correct script", () => {
    const orm = new FooBase()
    expect(orm
      .select(['email', 'password', 'id'])
      .from('users')
      .analyze()
      .finalSQL
    ).toEqual('select email, password, id from users')
  })

  it("should concatenate string with a clause to create a correct script", () => {
    const orm = new FooBase()
    expect(orm
      .select(['email', 'password', 'id'])
      .from('users')
      .eq('id', 123)
      .analyze()
      .finalSQL
    ).toEqual('select email, password, id from users where id = $1')
  })

  it("should concatenate string with multiple clauses to create a correct script", () => {
    const orm = new FooBase()
    expect(orm
      .select(['email', 'password', 'id'])
      .from('users')
      .eqs(['id', 'email', 'token', 'status'], [123, 'jtzuya@gmail.com', 'somerandomstring', 'unverified'])
      .analyze()
      .finalSQL
    ).toEqual('select email, password, id from users where id = $1 and email = $2 and token = $3 and status = $4')
  })

  it("should concatenate string with single column and values passed as argument to create a correct insert script", () => {
    const orm = new FooBase()
    expect(orm
      .insert('email', 'jtzuya@gmail.com')
      .from('users')
      .analyze()
      .finalSQL
    ).toEqual('insert into users (email) values ($1)')
  })

  it("should concatenate string with multiple column and values passed as argument to create a correct insert script", () => {
    const orm = new FooBase()
    expect(orm
      .insert(['email', 'password', 'token'], ['jtzuya@gmail.com', 'hash', 'asdasd'])
      .from('users')
      .analyze()
      .finalSQL
    ).toEqual('insert into users (email, password, token) values ($1, $2, $3)')
  })

  it("should concatenate string with column and value passed as argument to create a correct update script", () => {
    const orm = new FooBase()
    expect(orm
      .update('email', 'jtzuya@gmail.com')
      .from('users')
      .eq('id', 1001)
      .analyze()
      .finalSQL
    ).toEqual('update users set email = $1 where id = $2')
  })

  it("should concatenate string with multiple columns and values passed as argument to create a correct update script", () => {
    const orm = new FooBase()
    expect(orm
      .update(['email', 'password', 'token'], ['jtzuya@gmail.com', 'hash', 'randomstring'])
      .from('users')
      .eq('id', 1001)
      .analyze()
      .finalSQL
    ).toEqual('update users set email = $1, password = $2, token = $3 where id = $4')
  })

  it("should concatenate string with multiple columns and values passed as argument and multiple conditions to create a correct update script", () => {
    const orm = new FooBase()
    expect(orm
      .update(['email', 'password', 'token'], ['jtzuya@gmail.com', 'hash', 'randomstring'])
      .from('users')
      .eqs(['id', 'status'], [1001, 'verified'])
      .analyze()
      .finalSQL
    ).toEqual('update users set email = $1, password = $2, token = $3 where id = $4 and status = $5')
  })
})