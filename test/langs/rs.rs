// snake game

enum Direction {
    Up,
    Down,
    Left,
    Right,
}
const SPEED: u64 = 100;
const INITIAL_SNAKE_LENGTH: usize = 5;
const INITIAL_SNAKE_POSITION: (i32, i32) = (10, 10);
const BOARD_WIDTH: i32 = 20;
const INITIAL_SNAKE_DIRECTION: Direction = Direction::Right;
struct Snake {
    body: Vec<(i32, i32)>,
    direction: Direction,
}
impl Snake {
    fn new(
        initial_position: (i32, i32),
        initial_length: usize,
        initial_direction: Direction,
    ) -> Self {
        let mut body = Vec::new();
        for i in 0..initial_length {
            body.push((initial_position.0 - i as i32, initial_position.1));
        }
        Snake {
            body,
            direction: initial_direction,
        }
    }
}
fn main() {
    let mut snake = Snake::new(
        INITIAL_SNAKE_POSITION,
        INITIAL_SNAKE_LENGTH,
        INITIAL_SNAKE_DIRECTION,
    );

    loop {
        //!                                DONT DO THIS!!!!
        /*@code 
            if snake.direction == Direction::Right {
                snake.body[0].0 += 1;
            } else if snake.direction == Direction::Left {
                snake.body[0].0 -= 1;
            } else if snake.direction == Direction::Up {
                snake.body[0].1 -= 1;
            } else if snake.direction == Direction::Down {
                snake.body[0].1 += 1;
            }
        */
        match snake.direction {
            Direction::Right => snake.body[0].0 += 1,
            Direction::Left => snake.body[0].0 -= 1,
            Direction::Up => snake.body[0].1 -= 1,
            Direction::Down => snake.body[0].1 += 1,
        }
    }
}
