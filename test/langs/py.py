def main():
    value_a = 1

    value_b = 2

    value_c = 3
    # @code line_implicit = 12
    value_line_between = 13
    # @code line_implicit = 14

    # Comments with # remain ordinary comments unless followed by @code.

    value_d = 4

    print(value_a, value_b, value_c, value_d)


    #$ rate = lambda(T) : if (T>200): return(200*exp(-T)); else: return(400*exp(-T))

if __name__ == "__main__":
    main()
