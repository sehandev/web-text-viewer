package main

import (
	"context"
	"net/http"
	"time"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/labstack/gommon/log"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var ctx context.Context
var collection map[string]*mongo.Collection

func main() {
	e := echo.New()
	echoMiddleware(e)

	// MongoDB 연결 정보
	// mongoURI example : mongodb://[mongoID]:[mongoPassword]@localhost:27017/?authSource=admin
	mongoURI := getURI()

	// 연결 지연 timeout 10초 설정
	ctx, cancle := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancle()

	// MongoDB client 연결
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	errCheck(err)

	// MongoDB collection 연결
	collection = make(map[string]*mongo.Collection)
	db := client.Database("web_txt_viewer")
	collection["user"] = db.Collection("user")
	collection["start_id"] = db.Collection("start_id")
	collection["txt_content"] = db.Collection("txt_content")

	// Routes
	e.POST("/users", postUserJSON)
	e.GET("/users", getUserJSON)
	e.GET("/starts/:firebaseUUID", getStartJSON)
	e.GET("/contents/:txtID", getContentJSON)

	// Test
	// deleteTmp()
	// insertUser("sehandev")
	// insertNewTxt()

	// Start server
	e.Logger.Fatal(e.Start("localhost:9000"))
}

func postUserJSON(c echo.Context) error {
	userName := c.FormValue("user_name")
	userEmail := c.FormValue("user_email")
	firebaseUUID := c.FormValue("firebase_uuid")
	insertUser(userName, userEmail, firebaseUUID)

	return c.String(http.StatusOK, userEmail)
}

func getUserJSON(c echo.Context) error {
	userArr := getAllUserList()

	return c.JSON(http.StatusOK, userArr)
}

func getStartJSON(c echo.Context) error {
	firebaseUUID := c.Param("firebaseUUID")
	startIDArr := getAllStartIDByFirebaseUUID(firebaseUUID)

	return c.JSON(http.StatusOK, startIDArr)
}

func getContentJSON(c echo.Context) error {
	txtID := c.Param("txtID")
	tContent := getTxtContentByTxtID(txtID)

	return c.JSON(http.StatusOK, tContent)
}

func errCheck(e error) {
	if e != nil {
		panic(e)
	}
}

// echoMiddleware : set echo middleware
func echoMiddleware(e *echo.Echo) {

	e.Logger.SetLevel(log.ERROR)

	e.Use(middleware.LoggerWithConfig(
		middleware.LoggerConfig{
			Format: "\033[92m${method}\t${uri}\t\033[94m${status}\t${remote_ip}\n",
		}))

	e.Use(middleware.Recover())

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://viewer.sehandev.com"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))
}
