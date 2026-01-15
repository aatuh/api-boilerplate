package main

import (
	"api-boilerplate/internal/http/handlers"
	"api-boilerplate/migrations"
	"api-boilerplate/src/repos"
	"api-boilerplate/src/services/foosvc"
	"api-boilerplate/src/specs/endpoints"
	"context"
	"io/fs"
	"os"
	"os/signal"
	"time"

	"github.com/aatuh/api-toolkit/adapters/clock"
	"github.com/aatuh/api-toolkit/adapters/logzap"
	"github.com/aatuh/api-toolkit/adapters/txpostgres"
	"github.com/aatuh/api-toolkit/adapters/uuid"
	"github.com/aatuh/api-toolkit/adapters/validation"
	"github.com/aatuh/api-toolkit/bootstrap"
	"github.com/aatuh/api-toolkit/config"
	"github.com/aatuh/api-toolkit/endpoints/docs"
	"github.com/aatuh/api-toolkit/endpoints/health"
	versionep "github.com/aatuh/api-toolkit/endpoints/version"
	"github.com/aatuh/api-toolkit/middleware/metrics"
	"github.com/aatuh/api-toolkit/ports"
	"github.com/aatuh/api-toolkit/specs"
)

var (
	// Overridden at build time via -ldflags.
	version = "dev"
	commit  = "none"
	date    = "unknown"
)

// @title API Boilerplate API
// @version 1.0.0
// @description REST API Boilerplate Documentation
// @BasePath /api/v1
func main() {
	log := logzap.NewProduction()
	cfg := config.MustLoadFromEnv()

	ctx := context.Background()
	pool := bootstrap.OpenPoolOrExit(ctx, cfg.DatabaseURL, 3*time.Second, log)
	defer pool.Close()

	if cfg.MigrateOnStart {
		bootstrap.RunMigrationsOrExit(
			ctx, cfg, log, []fs.FS{migrations.Migrations},
		)
	}

	r := bootstrap.NewDefaultRouter(log)

	bootstrap.MountSystemEndpoints(r, bootstrap.SystemEndpoints{
		Health: health.NewDefaultHandler(pool),
		Docs: docs.NewHandler(docs.NewWithConfig(ports.DocsConfig{
			Title:       "API Boilerplate Documentation",
			Description: "REST API Boilerplate Documentation",
			Version:     "1.0.0",
			Paths:       ports.DefaultDocsPaths(),
			EnableHTML:  true,
			EnableJSON:  true,
			EnableYAML:  false,
		})),
		Version: versionep.NewHandler(versionep.Config{
			Path: specs.Version,
			Info: ports.VersionInfo{
				Version: version,
				Commit:  commit,
				Date:    date,
			},
		}),
		Metrics: metrics.PrometheusHandler(),
	})

	tx := txpostgres.New(pool)
	clk := clock.NewSystemClock()
	ids := uuid.NewUUIDGen()
	val := validation.NewBasicValidator()

	// Domain wiring
	fooRepo := repos.NewFooRepo(pool)
	fooSvc := foosvc.New(fooRepo, tx, log, clk, ids)
	fooH := handlers.NewFooHandler(fooSvc, log, val)
	r.Mount(endpoints.FooBase, fooH.Routes())

	srvCtx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stop()
	bootstrap.StartServerOrExit(srvCtx, cfg.Addr, r, log)
}
