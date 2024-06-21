# FooBase ORM

FooBase is a personalized ORM for Postgresql like supabase.

#### Check test cases at ./FooBase.spec.ts for reference

## Usage

```python
import { FooBase } from './FooBase

async function getAllEmail() {
 const orm = new FooBase()
 const {data, message} = await orm.select('email').from('users')
 return data
}

# If success: Returns all possible email data where email is equal to "jtzuya@gmail.com"
getAllEmail()

async function getEmail(id: number) {
 const orm = new FooBase()
 const {data, message} = await orm.select('*').eq('id', id)from('users')
 return data
}

# If success: Gets all the data of a user that has an id of 1
getEmail(1)
```

The `.from(tableName)` method should always be chained as the last method.  

## License
[MIT](https://choosealicense.com/licenses/mit/)

To install dependencies:

```bash
bun install
```

To run test cases:

```bash
bun test
```

This project was created using `bun init` in bun v1.1.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

