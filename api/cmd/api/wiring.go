package main

import (
	"api-boilerplate/internal/services/foosvc"
	"api-boilerplate/internal/store"

	"github.com/aatuh/api-toolkit/adapters/clock"
	"github.com/aatuh/api-toolkit/adapters/txpostgres"
	"github.com/aatuh/api-toolkit/adapters/uuid"
	"github.com/aatuh/api-toolkit/adapters/validation"
	"github.com/aatuh/api-toolkit/ports"
)

type appDeps struct {
	FooService *foosvc.Service
	Validator  ports.Validator
}

func buildAppDeps(log ports.Logger, pool ports.DatabasePool) appDeps {
	tx := txpostgres.New(pool)
	clk := clock.NewSystemClock()
	ids := uuid.NewUUIDGen()
	val := validation.NewBasicValidator()

	fooRepo := store.NewFooRepo(pool)
	fooSvc := foosvc.New(fooRepo, tx, log, clk, ids)

	return appDeps{
		FooService: fooSvc,
		Validator:  val,
	}
}
