package main

import (
	"net/http"

	"github.com/labstack/echo"
)

// e.GET("/users", getUser)
func getUser(c echo.Context) error {
	templateMap := map[string]interface{}{
		"userList": []string{"sehandev", "b", "c"},
	}
	return c.Render(http.StatusOK, "users.html", templateMap)
}

// e.GET("/starts/:userID", getStart)
func getStart(c echo.Context) error {
	userID := c.Param("userID") // 불러올 txtID
	templateMap := map[string]interface{}{
		"userID": userID,
	}
	return c.Render(http.StatusOK, "starts.html", templateMap)
}

// e.GET("/views/:txtID", getView)
func getView(c echo.Context) error {
	id := c.Param("txtID") // 불러올 txtID
	fontName := c.QueryParam("font-name")
	if fontName == "" {
		fontName = "font-sans"
	}
	fontSize := c.QueryParam("font-size")
	if fontSize == "" {
		fontSize = "font-small"
	}
	templateMap := map[string]interface{}{
		"txtID":    id,
		"fontName": fontName,
		"fontSize": fontSize,
	}
	return c.Render(http.StatusOK, "views.html", templateMap)
}
