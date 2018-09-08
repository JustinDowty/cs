#include "file_utils.h"
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

int read_file(const char* filename, char** buffer) {
  FILE* fp;

  fp = fopen(filename, "r");

  if (fp) {
    fread(&buffer, sizeof(char), sizeof(buffer)/sizeof(char), fp);
    fclose(fp);
  } else {
    fprintf(stderr, "BOYYYY THAT AINT A FILE, YA'LL");

    return errno;
  }

  return 0;
}

int write_file(const char* filename, char* buffer, size_t size) {
  FILE * fp;

  fp = fopen(filename, "w");

  if (fp) {
    fwrite(buffer, sizeof(char), size, fp);
    fclose(fp);
  } else {
    fprintf(stderr, "BOYYY WE CAN'T WRITE TO THIS FILE");

    return errno;
  }
  return 0;
}
