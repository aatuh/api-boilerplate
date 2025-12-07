package types

import (
	"errors"
	"strings"
	"time"

	"api-boilerplate/src/services/foosvc"
)

// CreateFooDTO is the HTTP request model for Foo creation.
type CreateFooDTO struct {
	OrgID     string `json:"org_id" validate:"required"`
	Namespace string `json:"namespace" validate:"required"`
	Name      string `json:"name" validate:"required"`
}

func (d CreateFooDTO) Validate() error {
	if strings.TrimSpace(d.OrgID) == "" {
		return errors.New("org_id is required")
	}
	if strings.TrimSpace(d.Namespace) == "" {
		return errors.New("namespace is required")
	}
	if strings.TrimSpace(d.Name) == "" {
		return errors.New("name is required")
	}
	return nil
}

func (d CreateFooDTO) ToInput() foosvc.CreateInput {
	return foosvc.CreateInput{
		OrgID:     strings.TrimSpace(d.OrgID),
		Namespace: strings.TrimSpace(d.Namespace),
		Name:      strings.TrimSpace(d.Name),
	}
}

// UpdateFooDTO is the HTTP request model for Foo update.
type UpdateFooDTO struct {
	Name *string `json:"name" validate:"required"`
}

func (d UpdateFooDTO) Validate() error {
	if d.Name == nil {
		return errors.New("name is required")
	}
	if strings.TrimSpace(*d.Name) == "" {
		return errors.New("name cannot be empty")
	}
	return nil
}

func (d UpdateFooDTO) ToInput(id string) foosvc.UpdateInput {
	name := strings.TrimSpace(*d.Name)
	return foosvc.UpdateInput{
		ID:   strings.TrimSpace(id),
		Name: &name,
	}
}

// FooDTO is the HTTP response model for Foo.
type FooDTO struct {
	ID        string    `json:"id" example:"01HZJ8K9M2N3P4Q5R6S7T8U9V"`
	OrgID     string    `json:"org_id" example:"org-123"`
	Namespace string    `json:"namespace" example:"default"`
	Name      string    `json:"name" example:"my-foo"`
	CreatedAt time.Time `json:"created_at" example:"2023-01-01T00:00:00Z"`
	UpdatedAt time.Time `json:"updated_at" example:"2023-01-01T00:00:00Z"`
}

// FromModel converts a foosvc.Foo to FooDTO.
func (d *FooDTO) FromModel(f *foosvc.Foo) {
	if f == nil {
		return
	}
	d.ID = f.ID
	d.OrgID = f.OrgID
	d.Namespace = f.Namespace
	d.Name = f.Name
	d.CreatedAt = f.CreatedAt
	d.UpdatedAt = f.UpdatedAt
}

// ListMeta describes pagination metadata for list responses.
type ListMeta struct {
	Total   int                 `json:"total"`
	Count   int                 `json:"count"`
	Limit   int                 `json:"limit"`
	Offset  int                 `json:"offset"`
	Filters map[string][]string `json:"filters,omitempty"`
	Search  string              `json:"search,omitempty"`
}

// FooListResponse is the paginated response contract for foos.
type FooListResponse struct {
	Data []FooDTO `json:"data"`
	Meta ListMeta `json:"meta"`
}
