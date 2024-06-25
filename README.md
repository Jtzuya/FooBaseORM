# FooBase ORM

FooBase is a personalized ORM for Postgresql like supabase.

#### Check test cases at ./FooBase.spec.ts for reference

## Usage

```python
import { FooBase } from './FooBase

const orm = new Foobase() // create a new instance

{
 // Gets all email from the users table
 const {data, message} = await orm
  .select('email')
  .from('users')
}

{
 // Gets all data from the users table where id is 3
 const {data, message} = await orm
  .select('*')
  .eq('id', id)
  .from('users')
}
```

## Important Note
- Always chain the `.from(tableName)` method as the last method in the chain.
- The sample code blocks above assume usage within an asynchronous function.

## Example
```javascript
async function fetchData() {
  // Example 1: Get All Emails from the Users Table
  const { data: emails, message: emailMessage } = await orm
    .select('email')
    .from('users');

  // Example 2: Get All Data from the Users Table Where ID is 3
  const { data: userData, message: userMessage } = await orm
    .select('*')
    .eq('id', 3)
    .from('users');

  // Handle the data and messages as needed
  console.log(emails, emailMessage);
  console.log(userData, userMessage);
}

fetchData(); // call the function
```

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

