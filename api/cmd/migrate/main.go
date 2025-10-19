package main

import (
	"context"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"os"
	"strings"
	"time"

	"api/migrations"

	"github.com/aatuh/api-toolkit/bootstrap"
	"github.com/aatuh/api-toolkit/logzap"
)

// Build with: go build -o bin/migrate ./cmd/migrate
// Usage:
//
//	DATABASE_URL=postgres://... bin/migrate up
//	DATABASE_URL=postgres://... bin/migrate down
//	DATABASE_URL=postgres://... bin/migrate status
func main() {
	var (
		dir    = flag.String("dir", "", "migrations dir override")
		table  = flag.String("table", "schema_migrations", "schema_migrations table")
		lock   = flag.Int64("lock", 0, "advisory lock key")
		allowD = flag.Bool("allow-down", false, "enable down")
	)
	flag.Parse()
	if len(flag.Args()) == 0 {
		log.Fatal("command required: up | down | status")
	}
	cmd := strings.ToLower(flag.Args()[0])

	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL env is required")
	}

	// Create and verify database pool
	ctx := context.Background()
	pool, err := bootstrap.OpenAndPingDB(ctx, dsn, 3*time.Second)
	if err != nil {
		log.Fatalf("open db: %v", err)
	}
	defer pool.Close()

	// Create migrator via bootstrap
	var dirs []string
	var embeddedFS []fs.FS
	if *dir != "" {
		dirs = []string{*dir}
	} else {
		embeddedFS = []fs.FS{embedded()}
	}
	m, err := bootstrap.NewMigrator(dsn, *table, *lock, *allowD, logzap.NewProduction(), dirs, embeddedFS)
	if err != nil {
		log.Fatalf("create migrator: %v", err)
	}
	defer m.Close()

	// Create context with timeout
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Minute)
	defer cancel()

	// Determine migration directory
	migrationDir := "."
	if *dir != "" {
		migrationDir = *dir
	}

	switch cmd {
	case "up":
		if err := bootstrap.RunUp(ctx, m, migrationDir); err != nil {
			log.Fatal(err)
		}
		log.Println("migrations applied successfully")
	case "down":
		if err := bootstrap.RunDown(ctx, m, migrationDir); err != nil {
			log.Fatal(err)
		}
		log.Println("migrations rolled back successfully")
	case "status":
		status, err := bootstrap.Status(ctx, m, migrationDir)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Print(status)
	default:
		log.Fatalf("unknown command: %s", cmd)
	}
}

// embedded returns the embedded FS with migrations.
func embedded() fs.FS {
	// Import the migrations from the main API
	// This will use the same embedded migrations as the main API
	return migrations.Migrations
}
