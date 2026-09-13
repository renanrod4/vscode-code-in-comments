/*@code(css)
    body {
        background-color: #f0f0f0;
        font-family: Arial, sans-serif;
    }
*/

/*@code(html)
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Sample Page</title>
            <link rel="stylesheet" href="styles.css">
        </head>
        <body>
            <h1>Hello, World!</h1>
            <script src="script.js"></script>
        </body>
    </html>
*/

/*@code(python)
    def greet(name):
        return f"Hello, {name}!"

    print(greet("Alice"))
*/

/*@code(java)
    public class Main {
        public static void main(String[] args) {
            int x = 10;
            if (x > 5) {
                System.out.println("x is greater than 5");
            } else {
                System.out.println("x is less than or equal to 5");
            }
        }
    }
*/

/*@code(cpp)
    #include <iostream>
    using namespace std;

    int main() {
        int x = 10;
        if (x > 5) {
            cout << "x is greater than 5" << endl;
        } else {
            cout << "x is less than or equal to 5" << endl;
        }
        return 0;
    }
*/

/*@code(ruby)
    x = 10
    if x > 5
        puts "x is greater than 5"
    else
        puts "x is less than or equal to 5"
    end
*/

/*@code(go)
    package main

    import "fmt"

    func main() {
        x := 10
        if x > 5 {
            fmt.Println("x is greater than 5")
        } else {
            fmt.Println("x is less than or equal to 5")
        }
    }
*/

/*@code(rust)
    fn main() {
        let value: i32 = 10;
        println!("value = {}", value);
    }
*/

/*@code(typescript)
    interface User {
        name: string;
        active: boolean;
    }

    const user: User = { name: "Alice", active: true };
    console.log(user.name);
*/

/*@code(tsx)
    type GreetingProps = { name: string };

    export function Greeting({ name }: GreetingProps) {
        return <h1>Hello, {name}!</h1>;
    }
*/

/*@code(json)
    {
        "name": "comment-code-blocks",
        "enabled": true,
        "languages": ["javascript", "rust", "python"]
    }
*/

/*@code(c)
    #include <stdio.h>

    int main(void) {
        printf("Hello, world!\n");
        return 0;
    }
*/

/*@code(csharp)
    using System;

    public class Program {
        public static void Main() {
            Console.WriteLine("Hello, world!");
        }
    }
*/

/*@code(kotlin)
    fun main() {
        val message: String = "Hello, world!"
        println(message)
    }
*/

/*@code(swift)
    let values = [1, 2, 3]
    for value in values {
        print("value = \(value)")
    }
*/

/*@code(shell)
    #!/usr/bin/env bash
    message="Hello, world!"
    printf '%s\n' "$message"
*/

/*@code(sql)
    SELECT id, username
    FROM users
    WHERE active = TRUE
    ORDER BY username;
*/

/*@code(yaml)
    name: comment-code-blocks
    version: 1
    enabled: true
    languages:
      - javascript
      - rust
*/

/*@code(lua)
    local message = "Hello, world!"
    for index = 1, 3 do
        print(index, message)
    end
*/

/*@code(php)
    <?php
    $message = "Hello, world!";
    echo $message;
*/

/*@code(perl)
    my $message = "Hello, world!";
    print "$message\n";
*/

/*@code(scala)
    object Main extends App {
        val values = List(1, 2, 3)
        println(values.sum)
    }
*/

/*@code(dart)
    void main() {
        final message = 'Hello, world!';
        print(message);
    }
*/

/*@code(powershell)
    $message = "Hello, world!"
    Write-Output $message
*/

/*@code(markdown)
    # Embedded Markdown

    This is a **formatted** example with a [link](https://example.com).
*/

/*@code(xml)
    <note>
        <to>Alice</to>
        <message>Hello, world!</message>
    </note>
*/

/*@code(css)
    .comment-code-block {
        display: block;
        color: #336699;
    }
*/
// Line comment examples
//@code(javascript) const message = "Hello, world!"; console.log(message);
//@code(typescript) const userName: string = "Alice";
//@code(json) { "enabled": true, "name": "comment-code-blocks" }
