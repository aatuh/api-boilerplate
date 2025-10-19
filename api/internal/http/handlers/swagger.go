package handlers

// ErrorResponse represents an error response for Swagger documentation.
type ErrorResponse struct {
	Error   string `json:"error" example:"bad request"`
	Message string `json:"message,omitempty"`
}

// SuccessResponse represents a success response for Swagger documentation.
type SuccessResponse struct {
	Message string `json:"message" example:"success"`
}
