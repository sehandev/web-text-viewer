package main

import (
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

	// Echo settings
	setEchoMiddleware(e)
	setEchoRenderer(e)

	// Static
	e.Static("/", "static")

	// Routes
	e.GET("/", getIndex)
	e.GET("/users", getUser)
	e.GET("/starts/:userID", getStart)
	e.GET("/views/:txtID", getView)

	// Start server
	e.Logger.Fatal(e.Start("localhost:9001"))
}

// setEchoMiddleware : Set echo middlewares
func setEchoMiddleware(e *echo.Echo) {

	// logger
	e.Logger.SetLevel(log.ERROR)
	e.Use(middleware.LoggerWithConfig(
		middleware.LoggerConfig{
			Format: "\033[92m${method}\t${uri}\t\033[94m${status}\n",
		}))

	// recover
	e.Use(middleware.Recover())
}
