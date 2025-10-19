package handlers

import (
	"net/http"
	pp "net/http/pprof"
)

func RegisterPprofRoutes(mux interface {
	Get(pattern string, h http.HandlerFunc)
}) {
	mux.Get("/debug/pprof/", pp.Index)
	mux.Get("/debug/pprof/cmdline", pp.Cmdline)
	mux.Get("/debug/pprof/profile", pp.Profile)
	mux.Get("/debug/pprof/symbol", pp.Symbol)
	mux.Get("/debug/pprof/trace", pp.Trace)
}
