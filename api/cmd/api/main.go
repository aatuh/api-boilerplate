package main

import (
	"api/internal/http/handlers"
	"api/migrations"
	"api/src/repos"
	"api/src/services/foosvc"
	"api/src/specs/endpoints"
	"context"
	"io/fs"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/aatuh/api-toolkit/bootstrap"
	"github.com/aatuh/api-toolkit/clock"
	"github.com/aatuh/api-toolkit/config"
	"github.com/aatuh/api-toolkit/docs"
	"github.com/aatuh/api-toolkit/health"
	"github.com/aatuh/api-toolkit/idgen"
	"github.com/aatuh/api-toolkit/logzap"
	"github.com/aatuh/api-toolkit/specs"
	"github.com/aatuh/api-toolkit/txpostgres"
	"github.com/aatuh/api-toolkit/validation"
)

var (
	version = "dev"
	commit  = "none"
	date    = "unknown"
)

func main() {
	// Logger
	log := logzap.NewProduction()

	// Config
	cfg := config.MustLoadFromEnv()

	// DB pool (for app runtime)
	ctx := context.Background()
	pool, err := bootstrap.OpenAndPingDB(ctx, cfg.DatabaseURL, 3*time.Second)
	if err != nil {
		log.Error("db connect failed", "err", err)
		os.Exit(1)
	}
	defer pool.Close()

	// Run migrations on start if enabled.
	if cfg.MigrateOnStart {
		var dirs []string
		var embedded []fs.FS
		if cfg.MigrationsDir == "-" || cfg.MigrationsDir == "" {
			embedded = []fs.FS{migrations.Migrations}
		} else {
			dirs = []string{cfg.MigrationsDir}
		}

		m, err := bootstrap.NewMigrator(
			cfg.DatabaseURL,
			"schema_migrations",
			0,
			false,
			log,
			dirs,
			embedded,
		)
		if err != nil {
			log.Error("migrator init failed", "err", err)
			os.Exit(1)
		}
		if err := bootstrap.RunUp(ctx, m, cfg.MigrationsDir); err != nil {
			log.Error("migrate up failed", "err", err)
			os.Exit(1)
		}
		_ = m.Close()
	}

	// Shared infra
	tx := txpostgres.New(pool)
	clk := clock.NewSystemClock()
	ids := idgen.NewULIDGen()

	// Domain wiring
	fooRepo := repos.NewFooRepo(pool)
	fooSvc := foosvc.New(fooRepo, tx, log, clk, ids)

	// Health manager
	healthManager := health.New()
	healthManager.RegisterCheckers(
		health.NewBasicChecker(),
		health.NewDatabaseChecker(pool),
		health.NewMemoryChecker(1024), // 1GB memory limit
	)
	healthHandler := health.NewHandler(healthManager)

	// Docs manager
	docsManager := docs.New()
	docsHandler := docs.NewHandler(docsManager)

	// Router
	r := bootstrap.NewDefaultRouter(log)

	// Register health, docs, and metrics routes
	bootstrap.MountSystemEndpoints(r, healthHandler, docsHandler)

	r.Get(specs.Version, func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"version":"` + version +
			`","commit":"` + commit + `","date":"` + date + `"}`))
	})

	// Validator
	validator := validation.NewBasicValidator()

	fooH := handlers.NewFooHandler(fooSvc, log, validator)
	r.Mount(endpoints.FooBase, fooH.Routes())

	// Server lifecycle
	srvCtx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stop()
	if err := bootstrap.StartServer(srvCtx, cfg.Addr, r, log); err != nil {
		log.Error("server error", "err", err)
	}
}
