def main():
    value_a = 1

    """py
        this_must_be_highlighted = true
        print(this_must_be_highlighted + "noice!")
    """

    value_b = 2

    """
        no_syntax_highlighting_here = true
    """

    value_c = 3
    # @code(python) line_explicit = 12
    value_line_between = 13
    # @code line_implicit = 14

    # Comments with # remain ordinary comments unless followed by @code.

    """py
    value_m = 12
    print(value_m)
    """

    value_d = 4

    print(value_a, value_b, value_c, value_d)


if __name__ == "__main__":
    main()
