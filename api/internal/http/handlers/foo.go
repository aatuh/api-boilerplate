// File: internal/http/handlers/foo.go
package handlers

import (
	"api/src/services/foosvc"
	endpointspec "api/src/specs/endpoints"
	"api/src/specs/types"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/aatuh/api-toolkit/chi"
	toolkitendpoints "github.com/aatuh/api-toolkit/endpoints"
	"github.com/aatuh/api-toolkit/httpx"
	"github.com/aatuh/api-toolkit/ports"
	"github.com/aatuh/api-toolkit/response_writer"
)

// FooHandler exposes HTTP endpoints for Foo service.
type FooHandler struct {
	Svc       *foosvc.Service
	Logger    ports.Logger
	Validator ports.Validator
}

func NewFooHandler(
	s *foosvc.Service, l ports.Logger, v ports.Validator,
) *FooHandler {
	return &FooHandler{Svc: s, Logger: l, Validator: v}
}

// Routes returns a ports.HTTPRouter mounted by main.
func (h *FooHandler) Routes() ports.HTTPRouter {
	r := chi.New()
	r.Post(endpointspec.FooCreate, h.create)
	r.Get(endpointspec.FooList, h.list)
	r.Get(endpointspec.FooByID, h.get)
	r.Put(endpointspec.FooUpdate, h.update)
	r.Delete(endpointspec.FooDelete, h.delete)
	return r
}

// create : POST /foo
func (h *FooHandler) create(w http.ResponseWriter, r *http.Request) {
	var dto types.CreateFooDTO
	if err := json.NewDecoder(r.Body).Decode(&dto); err != nil {
		writeErr(w, http.StatusBadRequest, "bad json")
		return
	}
	// First, struct-tag validator hooks (no-op if basic)
	if err := h.Validator.ValidateStruct(r.Context(), &dto); err != nil {
		writeErr(w, http.StatusBadRequest, err.Error())
		return
	}
	// Then, DTO's own custom rules
	if err := dto.Validate(); err != nil {
		writeErr(w, http.StatusBadRequest, err.Error())
		return
	}

	in := dto.ToInput()
	f, err := h.Svc.Create(r.Context(), in)
	if err != nil {
		writeDomainErr(w, err)
		return
	}

	var resp types.FooDTO
	resp.FromModel(f)
	response_writer.WriteJSON(w, http.StatusCreated, resp)
}

// get : GET /foo/{id}
func (h *FooHandler) get(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	f, err := h.Svc.Get(r.Context(), id)
	if err != nil {
		writeDomainErr(w, err)
		return
	}
	var resp types.FooDTO
	resp.FromModel(f)
	response_writer.WriteJSON(w, http.StatusOK, resp)
}

// update : PUT /foo/{id}
func (h *FooHandler) update(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimSpace(chi.URLParam(r, "id"))
	var dto types.UpdateFooDTO
	if err := json.NewDecoder(r.Body).Decode(&dto); err != nil {
		writeErr(w, http.StatusBadRequest, "bad json")
		return
	}
	if err := h.Validator.ValidateStruct(r.Context(), &dto); err != nil {
		writeErr(w, http.StatusBadRequest, err.Error())
		return
	}
	if err := dto.Validate(); err != nil {
		writeErr(w, http.StatusBadRequest, err.Error())
		return
	}

	in := dto.ToInput(id)
	f, err := h.Svc.Update(r.Context(), in)
	if err != nil {
		writeDomainErr(w, err)
		return
	}

	var resp types.FooDTO
	resp.FromModel(f)
	response_writer.WriteJSON(w, http.StatusOK, resp)
}

// delete : DELETE /foo/{id}
func (h *FooHandler) delete(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if err := h.Svc.Delete(r.Context(), id); err != nil {
		writeDomainErr(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// list : GET /foo?org_id=&namespace=&limit=&offset=&search=
func (h *FooHandler) list(w http.ResponseWriter, r *http.Request) {
	q := toolkitendpoints.ParseListQuery(r, toolkitendpoints.ListQueryConfig{
		DefaultLimit:   50,
		MaxLimit:       200,
		AllowedFilters: []string{"org_id", "namespace"},
		Required:       []string{"org_id", "namespace"},
	})
	if missing := q.MissingRequired(); len(missing) > 0 {
		writeErr(w, http.StatusBadRequest,
			"missing required filters: "+strings.Join(missing, ", "))
		return
	}

	orgID := q.First("org_id")
	ns := q.First("namespace")

	res, err := h.Svc.List(r.Context(), orgID, ns,
		q.Limit, q.Offset, q.Search)
	if err != nil {
		writeDomainErr(w, err)
		return
	}

	items := make([]types.FooDTO, len(res.Items))
	for i := range res.Items {
		items[i].FromModel(&res.Items[i])
	}

	meta := types.ListMeta{
		Total:  res.Total,
		Count:  len(items),
		Limit:  q.Limit,
		Offset: q.Offset,
		Search: q.Search,
	}
	if len(q.Filters) > 0 {
		meta.Filters = cloneFilterMap(q.Filters)
	}

	out := types.FooListResponse{
		Data: items,
		Meta: meta,
	}
	response_writer.WriteJSON(w, http.StatusOK, out)
}

func cloneFilterMap(in toolkitendpoints.Filters) map[string][]string {
	if len(in) == 0 {
		return nil
	}
	out := make(map[string][]string, len(in))
	for k, vals := range in {
		cp := make([]string, len(vals))
		copy(cp, vals)
		out[k] = cp
	}
	return out
}

func writeDomainErr(w http.ResponseWriter, err error) {
	switch err {
	case foosvc.ErrInvalid:
		httpx.WriteProblem(w, http.StatusBadRequest, httpx.Problem{
			Title:  http.StatusText(http.StatusBadRequest),
			Detail: err.Error(),
		})
	case foosvc.ErrNotFound:
		httpx.WriteProblem(w, http.StatusNotFound, httpx.Problem{
			Title:  http.StatusText(http.StatusNotFound),
			Detail: err.Error(),
		})
	case foosvc.ErrConflict:
		httpx.WriteProblem(w, http.StatusConflict, httpx.Problem{
			Title:  http.StatusText(http.StatusConflict),
			Detail: err.Error(),
		})
	default:
		httpx.WriteProblem(w, http.StatusInternalServerError, httpx.Problem{
			Title:  http.StatusText(http.StatusInternalServerError),
			Detail: "internal error",
		})
	}
}

func writeErr(w http.ResponseWriter, code int, msg string) {
	httpx.WriteProblem(w, code, httpx.Problem{
		Title:  http.StatusText(code),
		Detail: msg,
	})
}
