# Introduction

Hi, thanks for taking time to review my code.

In this section, I would like to explain the code structure of the project.

As you can see, I put all files under the root folder, the functionality of each file is:

* `db.js`: storing data while providing APIs for the outside to interact with the data.
* `controller.js`: combining database logic and business logic.
* `authentication.js`: verifying logging state and checking user permission.
* `bin.js`: handling the arguments passed from command line.
* `test.js`: running test cases.
* `utils.js`: some functions that can be used across the project.

# How the database works
When init an instance of the `DB` class, a file at `./db.json` will be created. The file will contain content in JSON format. The structure of the JSON is:

```json
{
    "books": [
        {
            "id": "Clean Code+Robert C. Martin",
            "metadata": {
                "title": "Clean Code",
                "author": "Robert C. Martin"
            },
            "borrowers": [],
            "inventory": 8
        }
    ],
    "users": [
        {
            "role": "admin",
            "username": "Alice",
            "password": "password1"
        },
        {
            "role": "user",
            "username": "Bob",
            "password": "password2"
        }
    ],
    "session": {
        "username": "Alice",
        "expiredTime": 1699799937109
    }
}
```

* `books`: is an array of information of a book.
  * `borrowers`: is the borrowers of a book.
  * `metadata`: is the intrinsic information of a book.

* `session`: is the session of the current logged-in user.
  * `expiredTime`: the time when the logged-in state got expired.

When writing data to the database, the `DB` class will write corresponding changes into the JSON file.

Similarly, when reading data from the database, the `DB` class will retrieve data from the JSON file.

# How the command line interface works
Currently, the commands mentioned in the description like `register`, `add`, `delete` etc are not commands that can be called in the command line.

Instead of calling those commands directly, we need to run the nodejs application firstly, following the rest command line arguments, for example:

```
node ./bin.js register admin Alice password1
```

# How the unit tests works
Without using any testing frameworks, the unit tests only compare the input with the output to check if the output meets the expectation or not.

If there's any test failed, the output will be like:

```
Failed test:
input: register admin Alice password1
expected output: Admin Alice successfully registered.
received output: Admin Alice successfully registered

Failed test: 
input: register user Bob password2
expected output: User Bob successfully registered.
received output: User Bob successfully registered
```
