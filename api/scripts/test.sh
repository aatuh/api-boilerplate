#!/bin/bash
set -e

# Delegate to Go-based test runner
exec go run ./api-toolkit/cmd/tester/main.go
