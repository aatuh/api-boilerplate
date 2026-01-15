package main

import (
	"api-boilerplate/internal/http/handlers"
	"api-boilerplate/src/specs/endpoints"

	"github.com/aatuh/api-toolkit/ports"
)

func mountAppRoutes(r ports.HTTPRouter, log ports.Logger, deps appDeps) {
	fooH := handlers.NewFooHandler(deps.FooService, log, deps.Validator)
	r.Mount(endpoints.FooBase, fooH.Routes())
}
