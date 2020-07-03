package main

import (
	"io"
	"text/template"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/labstack/gommon/log"
)

func errCheck(e error) {
	if e != nil {
		panic(e)
	}
}

func main() {
	e := echo.New()
	e.Logger.SetLevel(log.ERROR)
	echoMiddleware(e)
	renderer := &TemplateRenderer{
		templates: template.Must(template.ParseGlob("templates/*.html")),
	}
	e.Renderer = renderer

	// Static
	e.Static("/", "static")

	// Routes
	e.GET("/", getUser)
	e.GET("/users", getUser)
	e.GET("/starts/:userID", getStart)
	e.GET("/views/:txtID", getView)

	// Start server
	e.Logger.Fatal(e.Start("localhost:9001"))
}

func echoMiddleware(e *echo.Echo) {
	// Set echo middleware
	e.Use(middleware.LoggerWithConfig(
		middleware.LoggerConfig{
			Format: "\033[92m${method}\t${uri}\t\033[94m${status}\n",
		}))
	e.Use(middleware.Recover())
}

// TemplateRenderer : custom html/template renderer for Echo framework
type TemplateRenderer struct {
	templates *template.Template
}

// Render renders a template document
func (t *TemplateRenderer) Render(w io.Writer, name string, data interface{}, c echo.Context) error {

	// Add global methods if data is a map
	if viewContext, isMap := data.(map[string]interface{}); isMap {
		viewContext["reverse"] = c.Echo().Reverse
	}

	return t.templates.ExecuteTemplate(w, name, data)
}
