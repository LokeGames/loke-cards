#!/usr/bin/env bash
set -e

echo "Building and starting backend server..."
cd server
make
./server
