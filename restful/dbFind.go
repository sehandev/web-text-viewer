package main

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// TODO : bson 추가해서 바로 넣기
type content struct {
	ID      string `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
	NextID  string `json:"nextID"`
}

type userStruct struct {
	ID       string `json:"id" bson:"_id"`
	UserName string `json:"user_name" bson:"user_name"`
}

type startIDStruct struct {
	ID       string `json:"id" bson:"_id"`
	TxtID    string `json:"txt_id" bson:"txt_id"`
	TxtTitle string `json:"txt_title" bson:"txt_title"`
	UserID   string `json:"user_id" bson:"user_id"`
}

func getTxtContentByTxtID(txtID string) (tContent content) {
	txtObjectID, err := primitive.ObjectIDFromHex(txtID)
	errCheck(err)

	txtTitle, txtContent, nextID := findContentByTxtID(txtObjectID)
	tContent = content{
		ID:      txtObjectID.Hex(),
		Title:   txtTitle,
		Content: txtContent,
		NextID:  nextID.Hex(),
	}
	return
}

func getTxtContentByUserName(userName string) (tContent content) {
	userID := findUserIDByUserName(userName)

	startIDArr := findStartIDByUserID(userID)
	// 여기서 startID 중에서 고르는 프로세스가 추가로 들어가야함
	selectedIndex := len(startIDArr) - 1
	startID := startIDArr[selectedIndex]["txt_id"].(primitive.ObjectID)
	txtTitle, txtContent, nextID := findContentByTxtID(startID)
	tContent = content{
		ID:      startID.Hex(),
		Title:   txtTitle,
		Content: txtContent,
		NextID:  nextID.Hex(),
	}
	return
}

func findUserIDByUserName(userName string) primitive.ObjectID {
	// Mongodb find
	var result bson.M // _id, user_name
	err := collection["user"].FindOne(ctx, bson.M{"user_name": userName}).Decode(&result)
	errCheck(err)

	return result["_id"].(primitive.ObjectID)
}

func findStartIDByUserID(userID primitive.ObjectID) []bson.M {
	// Mongodb find

	cur, err := collection["start_id"].Find(ctx, bson.M{"user_id": userID})
	errCheck(err)
	defer cur.Close(ctx)

	var resultArr []bson.M

	for cur.Next(ctx) {
		// get data from MongoDB cursor
		var result bson.M // _id, user_id, txt_id
		err := cur.Decode(&result)
		errCheck(err)
		resultArr = append(resultArr, result)
	}

	// check after find everything
	err = cur.Err()
	errCheck(err)

	return resultArr
}

func findContentByTxtID(txtObjectID primitive.ObjectID) (txtTitle, txtContent string, nextID primitive.ObjectID) {
	// Mongodb find
	var result bson.M // _id, title, content, nextID
	err := collection["txt_content"].FindOne(ctx, bson.M{"_id": txtObjectID}).Decode(&result)
	errCheck(err)

	txtTitle = result["title"].(string)
	txtContent = result["content"].(string)
	nextID = result["nextID"].(primitive.ObjectID)
	return
}

// getStartIDByUserID : 모든 user 정보를 MongoDB에서 불러오기
func getUserList() (userArr []userStruct) {
	// Mongodb find
	var userResult userStruct // _id, user_name

	cur, err := collection["user"].Find(ctx, bson.M{})
	errCheck(err)

	for cur.Next(context.TODO()) {
		err := cur.Decode(&userResult)
		errCheck(err)

		// 추가
		userArr = append(userArr, userResult)
	}

	err = cur.Err()
	errCheck(err)

	cur.Close(context.TODO())

	return
}

// getStartIDByUserID : userID를 받아서 해당하는 모든 start 정보를 MongoDB에서 불러오기
func getStartIDByUserID(userID string) (startIDArr []startIDStruct) {
	userObjectID, err := primitive.ObjectIDFromHex(userID)
	errCheck(err)

	// Mongodb find
	var startIDResult startIDStruct // _id, txt_id, txt_title, user_id

	cur, err := collection["start_id"].Find(ctx, bson.M{"user_id": userObjectID})
	errCheck(err)

	for cur.Next(context.TODO()) {
		err := cur.Decode(&startIDResult)
		errCheck(err)

		// 추가
		startIDArr = append(startIDArr, startIDResult)
	}

	err = cur.Err()
	errCheck(err)

	cur.Close(context.TODO())

	return
}