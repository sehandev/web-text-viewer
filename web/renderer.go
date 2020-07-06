package main

import (
	"io"
	"text/template"

	"github.com/labstack/echo"
)

// setEchoRenderer sets echo renderer
func setEchoRenderer(e *echo.Echo) {

	// HTML Templates
	renderer := &templateRenderer{
		templates: template.Must(template.ParseGlob("templates/*.html")),
	}
	e.Renderer = renderer
}

// templateRenderer is custom html/template renderer for Echo framework
type templateRenderer struct {
	templates *template.Template
}

// Render renders a template document
func (t *templateRenderer) Render(w io.Writer, name string, data interface{}, c echo.Context) error {

	// Add global methods if data is a map
	if viewContext, isMap := data.(map[string]interface{}); isMap {
		viewContext["reverse"] = c.Echo().Reverse
	}

	return t.templates.ExecuteTemplate(w, name, data)
}
