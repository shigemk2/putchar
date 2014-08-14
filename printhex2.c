#include <stdio.h>

main() {
    void printhex(int *v) {
        printf("%p\n", v);
        *v = 0x12345678;
    }
}
