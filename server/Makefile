CXX = g++
CXXFLAGS = -I. -std=c++11 -pthread
LDFLAGS = -lsqlite3

all: server

server: main.cpp
	$(CXX) $(CXXFLAGS) -o server main.cpp $(LDFLAGS)

doxygen: Doxyfile
	doxygen Doxyfile

doc: doxygen

clean:
	rm -f server
	rm -rf man

.PHONY: all server doxygen doc clean
