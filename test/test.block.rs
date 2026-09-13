/*
```javascript
   console.log("Hello, world!");
   let x = 5;
   function even_or_odd(x) {
      switch (x % 2) {
         case 0:
            return "even";
         default:
            return "odd";
      }
   }
   console.log(`${x} is ${even_or_odd(x)}`);
```

```rust
   fn main() {
      println!("Hello, world!");
      let x = 5;
      fn even_or_odd(x: i32) -> &'static str {
         match x % 2 {
            0 => "even",
            _ => "odd"
         }
      }
      println!("{} is {}", x, even_or_odd(x));
   }
```
```python
   print("Hello, world!")
   x = 5
   def even_or_odd(x):
      if x % 2 == 0:
         return "even"
      else:
         return "odd"
   print(f"{x} is {even_or_odd(x)}")
```

```go
   package main
   import "fmt"

   func evenOrOdd(x int) string {
      if x%2 == 0 {
         return "even"
      }
      return "odd"
   }

   func main() {
      fmt.Println("Hello, world!")
      x := 5
      fmt.Printf("%d is %s\n", x, evenOrOdd(x))
   }
```
*/

fn main() {
   println!("Hello, world!");
   let x = 5;
   fn even_or_odd(x: i32) -> &'static str {
      match x % 2 {
         0 => "even",
         _ => "odd"
      }
   }
   println!("{} is {}", x, even_or_odd(x));
}ko