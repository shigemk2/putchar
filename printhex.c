#include <stdio.h>

void printhex(int *v) {
	printf("%p\n", v);
	*v = 0x12345678;
}
