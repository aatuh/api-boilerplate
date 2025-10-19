package endpoints

// Keep all endpoint constants under specs/endpoints.
// You already do this for other areas. :contentReference[oaicite:3]{index=3}
const (
	FooBase   = "/api/v1/foo"
	FooByID   = FooBase + "/{id}"
	FooList   = FooBase
	FooCreate = FooBase
	FooUpdate = FooByID
	FooDelete = FooByID
)
